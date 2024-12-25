import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './login.css';
import { authService } from '../../services/authService';

const Login = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    
    // Get user data from Redux store
    const avatar = useSelector(state => state.user.avatar);
    const userData = useSelector(state => state.user.userData);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'login') {
                const response = await authService.login(formData.email, formData.password);
                if (response.status === 'ERR') {
                    setError(response.message);
                    return;
                }
                setUserEmail(formData.email);
                onClose();
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Mật khẩu không khớp!');
                    return;
                }
                const response = await authService.register(
                    formData.email,
                    formData.password
                );
                if (response.status === 'ERR') {
                    setError(response.message);
                    return;
                }
                setActiveTab('login');
                setError('Đăng ký thành công! Vui lòng đăng nhập.');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi!');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUserEmail(null);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="login-modal">
            <div className="login-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                
                <div className="login-header">
                    <div className="login-tabs">
                        {userEmail ? (
                            <div className="user-section">
                                <div 
                                    className="user-avatar"
                                    style={avatar ? {
                                        backgroundImage: `url(${avatar})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    } : {}}
                                >
                                    {!avatar && (userData?.name?.charAt(0) || userEmail.charAt(0)).toUpperCase()}
                                </div>
                                <span className="user-email">{userEmail}</span>
                                <button onClick={handleLogout} className="logout-btn">
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="tab-buttons">
                                <button
                                    className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('login')}
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('register')}
                                >
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {!userEmail && (
                    <div className={`login-form ${loading ? 'loading' : ''}`}>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Nhập email"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            {activeTab === 'register' && (
                                <>
                                    <div className="form-group">
                                        <label>Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Nhập lại mật khẩu"
                                        />
                                    </div>
                                </>
                            )}

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
