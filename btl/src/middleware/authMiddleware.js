const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.access_token;
        
        if (!token) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Không tìm thấy token xác thực'
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'ERR',
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

module.exports = {
    authMiddleware
};
