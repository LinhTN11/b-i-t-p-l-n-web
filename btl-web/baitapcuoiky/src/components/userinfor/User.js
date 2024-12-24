import React, { useState } from 'react';
import './User.css';

const User = ({ email, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="user-container">
            <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="user-avatar">
                    {email.charAt(0).toUpperCase()}
                </div>
                <span className="user-email">{email}</span>
            </div>
            
            {showDropdown && (
                <div className="user-dropdown">
                    <button onClick={onLogout} className="logout-btn">
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
};

export default User;