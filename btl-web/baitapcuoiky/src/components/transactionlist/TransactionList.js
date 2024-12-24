import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeTransaction, fetchTransactions } from '../../features/transactionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import CategoryIcon from '../CategoryIcon';
import './TransactionList.css';

const TransactionList = ({ onEdit }) => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const selectedMonth = useSelector((state) => state.calendar.selectedMonth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filter transactions for the selected month
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const selectedDate = new Date(selectedMonth);
    return (
      transactionDate.getMonth() === selectedDate.getMonth() &&
      transactionDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Calculate totals for the current month
  const { totalIncome, totalExpense } = currentMonthTransactions.reduce(
    (acc, transaction) => {
      if (transaction.amount >= 0) {
        acc.totalIncome += parseFloat(transaction.amount);
      } else {
        acc.totalExpense += Math.abs(parseFloat(transaction.amount));
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const handleDelete = (id) => {
    if (!id) {
      console.error('Transaction ID is missing');
      return;
    }
    dispatch(removeTransaction(id));
  };

  const formatNumber = (number) => {
    return Math.abs(number).toLocaleString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="transaction-list">
      <h2>Danh sách giao dịch</h2>
      <div className="transaction-summary">
        <div className="summary-item income">
          <span>Tổng thu tháng {new Date(selectedMonth).getMonth() + 1}:</span>
          <span className="amount">{formatNumber(totalIncome)}đ</span>
        </div>
        <div className="summary-item expense">
          <span>Tổng chi tháng {new Date(selectedMonth).getMonth() + 1}:</span>
          <span className="amount">{formatNumber(totalExpense)}đ</span>
        </div>
      </div>
      <div className="transaction-items">
        {currentMonthTransactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-info">
              <div className="transaction-date">{formatDateTime(transaction.date)}</div>
              <div className="transaction-details">
                <div className="transaction-main">
                  <div className="category-with-amount">
                    <CategoryIcon category={transaction.category} />
                    <div className={`transaction-amount ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                      {transaction.amount >= 0 ? '+' : '-'}{formatNumber(transaction.amount)}đ
                    </div>
                  </div>
                </div>
                {transaction.note && <div className="transaction-note">{transaction.note}</div>}
              </div>
            </div>
            <div className="transaction-actions">
              <button 
                className="action-button edit-button" 
                onClick={() => onEdit(transaction)}
                title="Sửa giao dịch"
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
              <button 
                className="action-button delete-button" 
                onClick={() => handleDelete(transaction.id)}
                title="Xóa giao dịch"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
        {currentMonthTransactions.length === 0 && (
          <div className="no-transactions">
            Không có giao dịch nào trong tháng này
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;