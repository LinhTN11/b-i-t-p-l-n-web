const MonthlyLimit = require("../models/MonthlyLimit");

const createMonthlyLimit = (newMonthly) => {
    return new Promise(async (resolve, reject) => {
        const { userId, category, month, year, limit, totalSpent } = newMonthly
        try {
            const createdMonthlyLimit = await MonthlyLimit.create({
                userId,
                category,
                month,
                year,
                limit,
                totalSpent
            })
            if (createdMonthlyLimit) {
                resolve({
                    status: 'OK',
                    message: "Success",
                    data: createdMonthlyLimit
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateMonthlyLimit = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkMonthlyLimit = await MonthlyLimit.findOne({ _id: id })
            if (checkMonthlyLimit === null) {
                resolve({
                    status: "ERR",
                    message: "The monthlyLimit is not defined"
                })
            }
            const updateMonthlyLimit = await MonthlyLimit.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "Update Successful",
                data: updateMonthlyLimit
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteMonthlyLimit = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkMonthlyLimit = await MonthlyLimit.findOne({ _id: id })
            if (checkMonthlyLimit === null) {
                resolve({
                    status: "ERR",
                    message: "The monthlyLimit is not defined"
                })
            }
            await MonthlyLimit.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "Delete Successful",
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailMonthlyLimit = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const monthlyLimit = await MonthlyLimit.findOne({ _id: id })
            if (monthlyLimit === null) {
                resolve({
                    status: "ERR",
                    message: "The monthlyLimit is not defined"
                })
            }
            resolve({
                status: "OK",
                message: "Get monthlyLimit Successful",
                data: monthlyLimit
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllMonthlyLimit = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allMonthlyLimit = await MonthlyLimit.find()
            resolve({
                status: "OK",
                message: "Get All monthlyLimit Successful",
                data: allMonthlyLimit
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getMonthlyLimitsByUser = (userId, month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const monthlyLimits = await MonthlyLimit.find({
                userId,
                month,
                year
            })
            resolve({
                status: "OK",
                message: "Success",
                data: monthlyLimits
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createMonthlyLimit,
    updateMonthlyLimit,
    deleteMonthlyLimit,
    getDetailMonthlyLimit,
    getAllMonthlyLimit,
    getMonthlyLimitsByUser
}