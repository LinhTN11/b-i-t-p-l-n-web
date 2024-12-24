const UserDetails = require('../models/UserDetails');

const formatUserDetails = (details) => ({
    userId: details.userId,
    name: details.name || '',
    age: details.age || null,
    birthdate: details.birthdate || null,
    email: details.email || '',
    phone: details.phone || '',
    hometown: details.hometown || '', 
    avatar: details.avatar || '',
    totalIncome: details.totalIncome || 0,
    totalExpense: details.totalExpense || 0,
    lastUpdated: details.lastUpdated
});

const createUserDetails = async (userId, data) => {
    try {
        const existingDetails = await UserDetails.findOne({ userId });
        if (existingDetails) {
            throw new Error('User details already exist');
        }

        const newDetails = new UserDetails({
            userId,
            ...data,
            hometown: data.hometown || '', 
            lastUpdated: new Date()
        });

        const savedDetails = await newDetails.save();

        return {
            status: 'OK',
            message: 'Tạo thông tin chi tiết thành công',
            data: formatUserDetails(savedDetails)
        };
    } catch (error) {
        throw error;
    }
};

const updateUserDetails = async (userId, data) => {
    try {
        // Xử lý các trường đặc biệt
        if (data.age) {
            data.age = parseInt(data.age);
        }
        if (data.birthdate) {
            data.birthdate = new Date(data.birthdate);
        }

        const updatedDetails = await UserDetails.findOneAndUpdate(
            { userId },
            {
                ...data,
                lastUpdated: new Date()
            },
            { new: true, upsert: true }
        );

        return {
            status: 'OK',
            message: 'Cập nhật thông tin chi tiết thành công',
            data: formatUserDetails(updatedDetails)
        };
    } catch (error) {
        throw error;
    }
};

const getUserDetails = async (userId) => {
    try {
        const details = await UserDetails.findOne({ userId });
        if (!details) {
            throw new Error('Không tìm thấy thông tin chi tiết');
        }

        return {
            status: 'OK',
            message: 'Lấy thông tin chi tiết thành công',
            data: formatUserDetails(details)
        };
    } catch (error) {
        throw error;
    }
};

const updateFinancialInfo = async (userId, { totalIncome, totalExpense }) => {
    try {
        const updatedDetails = await UserDetails.findOneAndUpdate(
            { userId },
            {
                totalIncome,
                totalExpense,
                lastUpdated: new Date()
            },
            { new: true, upsert: true }
        );

        return {
            status: 'OK',
            message: 'Cập nhật thông tin tài chính thành công',
            data: formatUserDetails(updatedDetails)
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUserDetails,
    updateUserDetails,
    getUserDetails,
    updateFinancialInfo
};
