import axios from 'axios';

const API_URL = '/api';

export const fetchTransactions = async (search, month, page) => {
  const response = await axios.get(`/api/transactions`, {
    params: { search, month, page }
  });
 // console.log(response);
  
  return response.data.transactions;
};

export const fetchStatistics = async (month) => {
  const response = await axios.get(`/api/statistics`, { params: { month } });
 // console.log(response);
  
  return response.data;
};


export const fetchPriceStatistics = async (month) => {
  const response = await axios.get(`${API_URL}/price-statistics`, {
    params: { month }
  });
  return response.data;
};
