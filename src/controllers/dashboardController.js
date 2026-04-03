const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Admin, Analyst, Viewer
const getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      incomeCount: 0,
      expenseCount: 0,
    };

    summary.forEach((item) => {
      if (item._id === 'income') {
        result.totalIncome = item.total;
        result.incomeCount = item.count;
      } else if (item._id === 'expense') {
        result.totalExpenses = item.total;
        result.expenseCount = item.count;
      }
    });

    result.netBalance = result.totalIncome - result.totalExpenses;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category wise totals
// @route   GET /api/dashboard/categories
// @access  Admin, Analyst
const getCategoryTotals = async (req, res) => {
  try {
    const categories = await Transaction.aggregate([
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly trends
// @route   GET /api/dashboard/trends
// @access  Admin, Analyst
const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent transactions
// @route   GET /api/dashboard/recent
// @access  Admin, Analyst, Viewer
const getRecentTransactions = async (req, res) => {
  try {
    const recent = await Transaction.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(recent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentTransactions,
};