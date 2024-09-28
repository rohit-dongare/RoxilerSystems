const axios = require('axios');
const Transaction = require('../models/Transaction');

const feedDatabase = async (req, res) => {
    try {
        const response = await axios.get(process.env.SEED_DATABASE_URL);
        const transactions = response.data.map(transaction => ({
            title: transaction.title,
            price: transaction.price,
            description: transaction.description,
            category: transaction.category,
            image: transaction.image,
            sold: transaction.sold,
            dateOfSale: new Date(transaction.dateOfSale) 
        }));

        const result = await Transaction.insertMany(transactions);

        res.status(200).json({
            message: 'Database seeded successfully',
            insertedCount: result.length
        });
    } catch (error) {
        console.error('Error fetching or inserting data:', error); 
        res.status(500).send('Error fetching data');
    }
};


const getTransactions = async (req, res) => {
    try {
        const { page = 1, perPage = 10, search = '', month } = req.query;

        const query = {};

        const monthNames = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12
        };

        if (month && monthNames[month]) {
            const monthNumber = monthNames[month]; 
            query.$expr = {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]  
            };
        }

        if (search) {
      
            const isNumeric = !isNaN(search) && !isNaN(parseFloat(search));
            query.$or = [
                { title: { $regex: search, $options: 'i' } },       
                { description: { $regex: search, $options: 'i' } }, 
                { category: { $regex: search, $options: 'i' } }     
            ];
           
            if (isNumeric) {
                query.$or.push({ price: parseFloat(search) }); 
            }
        }

   
        const totalCount = await Transaction.countDocuments(query);

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)  
            .limit(parseInt(perPage));    

        res.status(200).json({
            page: parseInt(page),
            perPage: parseInt(perPage),
            totalCount, 
            totalPages: Math.ceil(totalCount / perPage), 
            transactions  
        });
    } catch (error) {
        console.error("Error fetching transactions:", error); 
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
};



const getStatistics = async (req, res) => {
    const { month } = req.query;
    const query = {};

    
    const monthNames = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };

    
    if (month && monthNames[month] !== undefined) {
        const monthIndex = monthNames[month]; 
        
        query.$expr = {
            $eq: [{ $month: "$dateOfSale" }, monthIndex] 
        };
    } else {
        return res.status(400).json({ success: false, message: 'Invalid month provided' });
    }

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

       
        const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });

      
        const totalUnsoldItems = await Transaction.countDocuments({ ...query, sold: false });

        const data = {
            totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
            totalSoldItems: totalSoldItems,
            totalUnsoldItems: totalUnsoldItems
        }

        
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};


const getPriceStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        
        const monthNames = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12
        };

        if (!month || !monthNames[month]) {
            return res.status(400).json({ success: false, message: 'Invalid month provided' });
        }

       
        const monthNumber = monthNames[month];

        
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        
        const statistics = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
            const count = await Transaction.countDocuments({
                price: { $gte: min, $lte: max },
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
            });
            return { range, count };
        }));

        
        res.status(200).json(statistics);
    } catch (error) {
        console.error("Error fetching price statistics:", error); 
        res.status(500).json({
            success: false,
            message: 'Error fetching price statistics',
            error: error.message 
        });
    }
};


const getCategoryStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        
        const monthNames = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12
        };

        if (!month || !monthNames[month]) {
            return res.status(400).json({ success: false, message: 'Invalid month provided' });
        }

        const monthNumber = monthNames[month];

        
        const categoryStatistics = await Transaction.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
                }
            },
            {
                $group: {
                    _id: "$category",
                    itemCount: { $sum: 1 } 
                }
            },
            {
                $project: {
                    _id: 0,          
                    category: "$_id", 
                    itemCount: 1       
                }
            }
        ]);

        
        res.status(200).json({
            success: true,
            data: categoryStatistics
        });
    } catch (error) {
        console.error("Error fetching category statistics:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category statistics',
            error: error.message 
        });
    }
};


const getCombinedStatistics = async (req, res) => {
    const { month } = req.query;

    const monthNames = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };

    if (!month || !monthNames[month]) {
        return res.status(400).json({ success: false, message: 'Invalid month provided' });
    }

    try {
        
        const statistics = await getStatistics({ query: { month } });
        const priceStatistics = await getPriceStatistics({ query: { month } });
        const categoryStatistics = await getCategoryStatistics({ query: { month } });

        
        if (!statistics.success || !priceStatistics.success || !categoryStatistics.success) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching one or more statistics',
            });
        }

        
        res.status(200).json({
            success: true,
            statistics: statistics,
            priceStatistics: priceStatistics,
            categoryStatistics: categoryStatistics
        });
    } catch (error) {
        console.error("Error fetching combined statistics:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching combined statistics',
            error: error.message 
        });
    }
};




module.exports = { feedDatabase, getTransactions, getStatistics, getPriceStatistics, getCategoryStatistics, getCombinedStatistics };
