import React from 'react';
import userIcon from './profile-user.png';

const Header = ({ onNavClick, onLoginClick }) => {
  const navItems = ['Tổng quan', 'Số giao dịch', 'Ghi chép giao dịch', 'Ngân sách'];

  return (
    <header className="header">
      <nav>
        <ul>
          {navItems.map((item, index) => (
            <li key={index} onClick={() => onNavClick(item)}>
              {item}
            </li>
          ))}
          <li style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <button onClick={onLoginClick} className="login-button" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <img 
                src={userIcon}
                alt="User Icon" 
                style={{ width: "24px", height: "24px" }} 
              />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
