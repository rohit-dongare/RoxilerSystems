
import React, { useEffect, useState } from 'react';
import { fetchTransactions, fetchStatistics  } from '../services/api'; 
import PriceStatisticsChart from './PriceStatisticsChart'; 

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('March');
  const [page, setPage] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalUnsoldItems: 0,
});

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions(search, month, page); 
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };


    const loadStatistics = async () => {
      try {
          const stats = await fetchStatistics(month); 
          setStatistics(stats);
      } catch (error) {
          console.error('Failed to fetch statistics:', error);
      }
  };


    loadTransactions(); 
    loadStatistics();
  }, [search, month, page]);

  return (
    <div className="p-4">

      <div className='flex flex-row items-center justify-center gap-10 sm:gap-20 mb-4'>
           
          <input
            type="text"
            placeholder="Search transactions"
            className="p-2 border rounded-md w-60 mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

         
          <select
            className="p-2 border rounded-md mb-4"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((monthName) => (
              <option key={monthName} value={monthName}>{monthName}</option>
            ))}
          </select>
      </div>


       
       <div className="mb-4 p-4 border rounded-lg bg-blue-300">
                <h2 className="text-lg font-bold">Transaction Statistics for {month}</h2>
                <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
                <p>Total Sold Items: {statistics.totalSoldItems}</p>
                <p>Total Not Sold Items: {statistics.totalUnsoldItems}</p>
        </div>


      <div className='mb-[50px]'>
        <h1 className='text-2xl font-bold'>Bar Chart Stats: {month}</h1>
         <PriceStatisticsChart month={month} />
      </div>
      

      <table className="min-w-full bg-blue-200 shadow-md rounded-md">
        <thead>
          <tr className="bg-blue-300 text-black uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Price</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Sold</th>
            <th className="py-3 px-6 text-left">Image</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{transaction._id}</td>
              <td className="py-3 px-6 text-left">{transaction.title}</td>
              <td className="py-3 px-6 text-left">{transaction.description}</td>
              <td className="py-3 px-6 text-left">{transaction.price}</td>
              <td className="py-3 px-6 text-left">
                {transaction.category}
              </td>
              <td className="py-3 px-6 text-left">{transaction.sold ? 'Yes' : 'No'}</td>
              <td className="py-3 px-6 text-left">
                <img src={transaction.image} width={400} height={400} alt="" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
