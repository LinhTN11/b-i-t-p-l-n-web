import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import userIcon from './profile-user.png';
import './header.css';

const Header = ({ onNavClick, onLoginClick, currentView }) => {
  const [avatar, setAvatar] = useState(userIcon);
  const [selectedItem, setSelectedItem] = useState('Tổng quan');
  const navItems = ['Tổng quan', 'Số giao dịch', 'Ghi chép giao dịch', 'Ngân sách'];
  const userData = useSelector((state) => state.user.userData);
  const isLoggedIn = !!userData;

  useEffect(() => {
    console.log('Current user data from Redux:', userData);
    if (userData && userData.avatar) {
      setAvatar(userData.avatar);
    }
  }, [userData]);

  // Theo dõi thay đổi của currentView để cập nhật selectedItem
  useEffect(() => {
    if (currentView && navItems.includes(currentView)) {
      setSelectedItem(currentView);
    }
  }, [currentView]);

  const handleNavClick = (item) => {
    setSelectedItem(item);
    onNavClick(item);
  };

  return (
    <header className="header">
      <nav>
        <ul>
          {navItems.map((item, index) => (
            <li 
              key={index} 
              onClick={() => handleNavClick(item)}
              className={`nav-item ${selectedItem === item ? 'selected' : ''} ${item === 'Ghi chép giao dịch' ? 'record-transaction' : ''}`}
            >
              {item}
            </li>
          ))}
          <li style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <button 
              onClick={onLoginClick}
              className="avatar-button"
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                outline: "none",
                boxShadow: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                transition: "transform 0.3s ease"
              }}
            >
              <img 
                src={avatar}
                alt="User Icon" 
                className="avatar-image"
                style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: isLoggedIn ? "1px solid #000" : "none",
                  padding: 0,
                  transition: "transform 0.3s ease"
                }}
                onError={(e) => {
                  console.error('Avatar load error, falling back to default icon');
                  e.target.src = userIcon;
                }}
              />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;