const UserService = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, age } = req.body;
        const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        const isCheckEmail = regexEmail.test(email);
        
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(400).json({
                status: "ERR",
                message: "The input is required"
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: "ERR",
                message: "The input is email"
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "The password is equal confirmPassword"
            });
        }
        
        const response = await UserService.createUser({
            name,
            email,
            password,
            phone,
            age: age || null
        });
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            status: "ERR",
            message: e.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "ERR",
                message: "Email và mật khẩu là bắt buộc"
            });
        }

        const response = await UserService.loginUser(req.body);
        
        // Set cookies for tokens
        res.cookie('access_token', response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.cookie('refresh_token', response.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            status: 'OK',
            message: 'Đăng nhập thành công',
            data: response.data,
            access_token: response.access_token
        });
    } catch (e) {
        return res.status(404).json({
            status: "ERR",
            message: e.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        
        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "UserId là bắt buộc"
            });
        }

        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            status: "ERR",
            message: e.message
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        
        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "UserId là bắt buộc"
            });
        }

        const response = await UserService.updateUserProfile(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            status: "ERR",
            message: e.message
        });
    }
};

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "UserId là bắt buộc"
            });
        }

        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            status: "ERR",
            message: e.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        // Clear cookies
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công'
        });
    } catch (e) {
        return res.status(404).json({
            status: "ERR",
            message: e.message
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    updateUserProfile,
    getDetailsUser,
    logoutUser
};