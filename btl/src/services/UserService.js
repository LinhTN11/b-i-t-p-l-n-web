const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generalAccessToken, generalRefreshToken } = require('./JwtService');

const formatUserData = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: user.age || null,
    birthdate: user.birthdate || null,
    avatar: user.avatar || '',
    bio: user.bio || '',
    occupation: user.occupation || '',
    location: user.location || '',
    joinDate: user.joinDate,
    preferences: user.preferences || {
        currency: 'VND',
        language: 'vi',
        theme: 'light'
    },
    userInfoCard: user.userInfoCard || {
        totalIncome: 0,
        totalExpense: 0,
        totalBalance: 0,
        monthlyBudget: 0,
        savingsGoal: 0,
        expenseLimit: 0,
        lastUpdated: new Date()
    }
});

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone, age, birthdate } = newUser;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser !== null) {
                reject({
                    status: "ERR",
                    message: "Email đã tồn tại"
                });
                return;
            }
            
            const hash = bcrypt.hashSync(password, 10);
            const userData = {
                name,
                email, 
                password: hash, 
                phone,
                joinDate: new Date(),
                preferences: {
                    currency: 'VND',
                    language: 'vi',
                    theme: 'light'
                },
                userInfoCard: {
                    totalIncome: 0,
                    totalExpense: 0,
                    totalBalance: 0,
                    monthlyBudget: 0,
                    savingsGoal: 0,
                    expenseLimit: 0,
                    lastUpdated: new Date()
                }
            };

            // Thêm các trường tùy chọn
            if (age !== null && age !== undefined && age !== '') {
                userData.age = parseInt(age);
            }
            if (birthdate !== null && birthdate !== undefined && birthdate !== '') {
                userData.birthdate = new Date(birthdate);
            }

            const createdUser = await User.create(userData);

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: "Đăng ký thành công",
                    data: formatUserData(createdUser)
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                reject({
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại'
                });
                return;
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                reject({
                    status: 'ERR',
                    message: 'Mật khẩu không chính xác'
                });
                return;
            }

            const access_token = generalAccessToken({
                id: checkUser._id,
                email: checkUser.email
            });

            const refresh_token = generalRefreshToken({
                id: checkUser._id,
                email: checkUser.email
            });

            resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                data: formatUserData(checkUser),
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            if (checkUser === null) {
                reject({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                });
                return;
            }

            // Xử lý các trường đặc biệt
            if (data.age === '') {
                data.age = null;
            } else if (data.age) {
                data.age = parseInt(data.age);
            }

            if (data.birthdate === '') {
                data.birthdate = null;
            } else if (data.birthdate) {
                data.birthdate = new Date(data.birthdate);
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin thành công',
                data: formatUserData(updatedUser)
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUserProfile = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allowedUpdates = ['name', 'age', 'birthdate', 'avatar', 'bio', 'occupation', 'location', 'phone', 'preferences'];
            const updates = Object.keys(data).filter(key => allowedUpdates.includes(key));
            
            if (updates.length === 0) {
                reject({
                    status: 'ERR',
                    message: 'Không có thông tin hợp lệ để cập nhật'
                });
                return;
            }

            // Xử lý các trường đặc biệt
            const updateData = {};
            updates.forEach(update => {
                if (update === 'age') {
                    if (data[update] === '') {
                        updateData[update] = null;
                    } else {
                        updateData[update] = parseInt(data[update]);
                    }
                } else if (update === 'birthdate') {
                    if (data[update] === '') {
                        updateData[update] = null;
                    } else {
                        updateData[update] = new Date(data[update]);
                    }
                } else {
                    updateData[update] = data[update];
                }
            });

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            );

            if (!updatedUser) {
                reject({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin thành công',
                data: formatUserData(updatedUser)
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                reject({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                });
                return;
            }
            resolve({
                status: 'OK',
                message: 'Lấy thông tin người dùng thành công',
                data: formatUserData(user)
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUserInfoCard = (id, cardData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                reject({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại'
                });
                return;
            }

            // Cập nhật thông tin card
            user.userInfoCard = {
                ...user.userInfoCard,
                ...cardData,
                lastUpdated: new Date()
            };

            const updatedUser = await user.save();

            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin card thành công',
                data: formatUserData(updatedUser)
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    updateUserProfile,
    getDetailsUser,
    updateUserInfoCard
};