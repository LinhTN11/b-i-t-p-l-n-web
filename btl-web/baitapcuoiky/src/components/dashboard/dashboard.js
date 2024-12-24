import React from 'react';
import { useSelector } from 'react-redux';
import './dashboard.css';

const Dashboard = () => {
  const { transactions } = useSelector((state) => state.transactions || { transactions: [] });

  console.log('All transactions:', transactions);

  // Kiểm tra dữ liệu giao dịch
  if (!Array.isArray(transactions)) {
    console.error('Transactions is not an array:', transactions);
    return <div>Không có dữ liệu giao dịch</div>;
  }

  // Lọc thu nhập
  const incomes = transactions.filter(t => Number(t.amount) > 0);
  console.log('Income transactions:', incomes);

  // Tổng thu nhập
  const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
  console.log('Total income:', totalIncome);

  // Lọc chi tiêu
  const expenses = transactions.filter(t => Number(t.amount) < 0);
  console.log('Expense transactions:', expenses);

  // Tổng chi tiêu
  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  console.log('Total expense:', totalExpense);

  // Số dư
  const balance = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  console.log('Balance:', balance);

  // Định dạng số
  const formatNumber = (number) => {
    return Math.abs(number).toLocaleString('vi-VN');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-item">
        <h3>Tổng thu</h3>
        <p className="income">{formatNumber(totalIncome)}đ</p>
      </div>
      <div className="dashboard-item">
        <h3>Tổng chi</h3>
        <p className="expense">{formatNumber(totalExpense)}đ</p>
      </div>
      <div className="dashboard-item">
        <h3>Số dư</h3>
        <p className={`balance ${balance < 0 ? 'expense' : 'income'}`}>
            {balance < 0 ? '-' : ''}{formatNumber(Math.abs(balance))}đ
        </p>

      </div>
    </div>
  );
};

export default Dashboard;