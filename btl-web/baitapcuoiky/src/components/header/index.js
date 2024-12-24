import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

const Header = ({ onNavClick, onLoginClick, userEmail, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <header className="header">
      <div className="logo">
        <h1>Quản lý chi tiêu</h1>
      </div>
      <nav className="nav-menu">
        <button onClick={() => onNavClick('/')}>Dashboard</button>
        <button onClick={() => onNavClick('/transactions')}>Giao dịch</button>
        <div className="auth-section" ref={dropdownRef}>
          {userEmail ? (
            <>
              <div className="user-avatar" onClick={() => setShowDropdown(!showDropdown)}>
                {userEmail.charAt(0).toUpperCase()}
              </div>
              {showDropdown && (
                <div className="user-dropdown">
                  <button className="info-btn">
                    <FontAwesomeIcon icon="user" /> Thông tin
                  </button>
                  <button onClick={onLogout} className="logout-btn">
                    <FontAwesomeIcon icon="sign-out-alt" /> Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={onLoginClick} className="login-button">
              Đăng nhập
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
