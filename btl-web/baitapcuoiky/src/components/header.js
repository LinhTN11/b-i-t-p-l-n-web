import React from 'react';

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
          <li>
            <button onClick={onLoginClick} className="login-button">
              Đăng nhập
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
