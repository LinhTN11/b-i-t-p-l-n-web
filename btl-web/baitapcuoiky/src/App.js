import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUtensils,
  faBus,
  faGamepad,
  faShoppingBag,
  faFileInvoiceDollar,
  faEllipsisH,
  faMoneyBillWave,
  faStar,
  faChartLine,
  faRightToBracket,
  faUser,
  faSignOutAlt,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

import Dashboard from './components/dashboard/dashboard';
import Calendar from './components/calendar/Calendar';
import Header from './components/header';
import TransactionList from './components/transactionlist/TransactionList';
import TransactionNote from './components/transactionNote/TransactionNote';
import BudgetForm from './components/budget';
import BudgetList from './components/budget/BudgetList';
import Login from './components/login/login';
import User from './components/userinfor/User';
import OverAll from './components/overall/OverAll';
import './App.css';

library.add(
  faUtensils,
  faBus,
  faGamepad,
  faShoppingBag,
  faFileInvoiceDollar,
  faEllipsisH,
  faMoneyBillWave,
  faStar,
  faChartLine,
  faRightToBracket,
  faUser,
  faSignOutAlt,
  faSignInAlt
);

const DashboardContent = ({ onEdit }) => {
  return (
    <div className="main-content">
      <OverAll />
    </div>
  );
};

const TransactionContent = ({ onEdit }) => {
  const { transactions, totalExpense } = useSelector((state) => state.transactions);
  return (
    <div className="main-content">
      <div className="left-content">
        <Dashboard totalExpense={totalExpense} />
        <Calendar transactions={transactions} />
      </div>
      <div className="right-content">
        <TransactionList onEdit={onEdit} />
      </div>
    </div>
  );
};

const App = () => {
  const [showTransactionNote, setShowTransactionNote] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionNote(true);
  };

  const handleNavClick = (item) => {
    if (item === 'Ghi chép giao dịch') {
      setShowTransactionNote(true);
      setEditingTransaction(null);
    } else if (item === 'Ngân sách') {
      navigate('/budgets');
    } else if (item === 'Tổng quan') {
      navigate('/overall');
    } else if (item === 'Số giao dịch') {
      navigate('/transactions');
    }
  };

  const handleCloseTransactionNote = () => {
    setShowTransactionNote(false);
    setEditingTransaction(null);
  };

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
  };

  const handleLogout = () => {
    setUserEmail(null);
  };

  return (
    <div className="app">
      <Header 
        onNavClick={handleNavClick} 
        onLoginClick={() => setShowLogin(true)}
        userEmail={userEmail}
        onLogout={handleLogout}
        editingTransaction={editingTransaction}
        showTransactionNote={showTransactionNote}
        onCloseTransactionNote={handleCloseTransactionNote}
      />
      {userEmail && (
        <User email={userEmail} onLogout={handleLogout} />
      )}
      {showTransactionNote && (
        <TransactionNote 
          onClose={handleCloseTransactionNote}
          editingTransaction={editingTransaction}
        />
      )}
      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Routes>
        <Route path="/" element={<DashboardContent onEdit={handleEdit} />} />
        <Route path="/overall" element={<OverAll />} />
        <Route path="/transactions" element={<TransactionContent onEdit={handleEdit} />} />
        <Route path="/create-budget" element={<BudgetForm />} />
        <Route path="/edit-budget" element={<BudgetForm />} />
        <Route path="/budgets" element={<BudgetList />} />
      </Routes>
    </div>
  );
};

export default App;