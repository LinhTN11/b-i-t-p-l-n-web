const ExpenseService = require('../services/ExpenseService')

const createExpense = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { userId, category, amount, date, note } = req.body
        if (!userId || !category || !amount || !date) {
            console.log('Missing required fields:', { userId, category, amount, date });
            return res.status(200).json({
                status: "ERR",
                message: "The input is required"
            })
        }
        const response = await ExpenseService.createExpense(req.body)
        console.log('Response:', response);
        return res.status(200).json(response)
    } catch (e) {
        console.error('Error:', e);
        return res.status(404).json({
            message: e
        })
    }
}

const updateExpense = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const expenseId = req.params.id
        const data = req.body
        if (!expenseId || !data.userId) {
            console.log('Missing expenseId or userId:', { expenseId, userId: data.userId });
            return res.status(200).json({
                status: "ERR",
                message: "The expenseId and userId are required"
            })
        }
        const response = await ExpenseService.updateExpense(expenseId, data)
        console.log('Response:', response);
        return res.status(200).json(response)
    } catch (e) {
        console.error('Error:', e);
        return res.status(404).json({
            message: e
        })
    }
}

const deleteExpense = async (req, res) => {
    try {
        console.log('Request params:', req.params);
        const expenseId = req.params.id
        if (!expenseId) {
            console.log('Missing expenseId:', expenseId);
            return res.status(200).json({
                status: "ERR",
                message: "The expenseId is required"
            })
        }
        const response = await ExpenseService.deleteExpense(expenseId)
        console.log('Response:', response);
        return res.status(200).json(response)
    } catch (e) {
        console.error('Error:', e);
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailExpense = async (req, res) => {
    try {
        console.log('Request params:', req.params);
        const expenseId = req.params.id
        if (!expenseId) {
            console.log('Missing expenseId:', expenseId);
            return res.status(200).json({
                status: "ERR",
                message: "The expenseId is required"
            })
        }
        const response = await ExpenseService.getDetailExpense(expenseId)
        console.log('Response:', response);
        return res.status(200).json(response)
    } catch (e) {
        console.error('Error:', e);
        return res.status(404).json({
            message: e
        })
    }
}

const getAllExpense = async (req, res) => {
    try {
        console.log('Request query:', req.query);
        const userId = req.query.userId; 
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "UserId is required"
            });
        }
        const response = await ExpenseService.getAllExpense(userId)
        console.log('Response:', response);
        return res.status(200).json(response)
    } catch (e) {
        console.error('Error:', e);
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createExpense,
    updateExpense,
    deleteExpense,
    getDetailExpense,
    getAllExpense
}