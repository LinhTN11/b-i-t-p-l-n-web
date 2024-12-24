const MonthlyLimitService = require('../services/MonthlyLimitService');

const createMonthlyLimit = async (req, res) =>{
    try{
        const { userId, category, month, year, limit, totalSpent } = req.body
        if ( !userId || !category || !month || !year || !limit ){
            return res.status(200).json({
                status: "ERR" ,
                message: "The input is required"
            })
        }
        const response = await MonthlyLimitService.createMonthlyLimit({
            userId,
            category,
            month,
            year,
            limit,
            totalSpent: totalSpent || 0
        })
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updateMonthlyLimit = async  (req, res) =>{
    try{
        const monthlyLimitId = req.params.id
        const data = req.body
        if (!monthlyLimitId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The monthlyLimitId is required"
            })
        }
        const response = await MonthlyLimitService.updateMonthlyLimit(monthlyLimitId, data) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMonthlyLimit = async (req, res) =>{
    try{
        const monthlyLimitId = req.params.id
        if (!monthlyLimitId){
            return res.status(200).json({
                status: "ERR" ,
                message: "The monthlyLimitId is required"
            })
        }
        const response = await MonthlyLimitService.deleteMonthlyLimit(monthlyLimitId) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailMonthlyLimit = async (req, res) =>{
    try {
        const monthlyLimitId = req.params.id
        if(!monthlyLimitId){
            return res.status(200).json({
                status: "ERR",
                message: "The monthlyLimitId is required"
            })
        }
        const response = await MonthlyLimitService.getDetailMonthlyLimit(monthlyLimitId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllMonthlyLimit = async (req, res) =>{
    try {
        const response = await MonthlyLimitService.getAllMonthlyLimit()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getMonthlyLimitsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;

        if (!userId || !month || !year) {
            return res.status(200).json({
                status: "ERR",
                message: "UserId, month and year are required"
            });
        }

        const response = await MonthlyLimitService.getMonthlyLimitsByUser(userId, month, year);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

module.exports = {
    createMonthlyLimit,
    updateMonthlyLimit,
    deleteMonthlyLimit,
    getDetailMonthlyLimit,
    getAllMonthlyLimit,
    getMonthlyLimitsByUser
}