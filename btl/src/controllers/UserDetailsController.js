const UserDetailsService = require('../services/UserDetailsService');

const createUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await UserDetailsService.createUserDetails(userId, req.body);
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await UserDetailsService.updateUserDetails(userId, req.body);
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await UserDetailsService.getUserDetails(userId);
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const updateFinancialInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await UserDetailsService.updateFinancialInfo(userId, req.body);
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    createUserDetails,
    updateUserDetails,
    getUserDetails,
    updateFinancialInfo
};
