const express = require('express');
const { getTransactions, feedDatabase, getStatistics, getPriceStatistics, getCategoryStatistics, getCombinedStatistics } = require('../controllers/transactionController');
const router = express.Router();

router.get('/store', feedDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/price-statistics', getPriceStatistics);
router.get('/category-statistics', getCategoryStatistics);
router.get('/combined-statistics', getCombinedStatistics);

module.exports = router;
