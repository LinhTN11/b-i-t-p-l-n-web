import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchBudgets, removeBudget } from '../../features/budgetSlice';
import { fetchTransactions } from '../../features/transactionSlice';
import api from '../../services/api';
import './BudgetList.css';

const BudgetList = () => {
  const { budgets, isLoading, isError, message } = useSelector((state) => state.budgets);
  const transactions = useSelector((state) => state.transactions.transactions);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [remainingDays, setRemainingDays] = useState(0);
  const [monthlyLimits, setMonthlyLimits] = useState({});

  // Fetch initial data
  useEffect(() => {
    console.log('Fetching data...');
    const fetchData = async () => {
      try {
        await dispatch(fetchBudgets()).unwrap();
        const transactionResult = await dispatch(fetchTransactions()).unwrap();
        console.log('Fetched transactions:', transactionResult);
        await fetchMonthlyLimits();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Log whenever transactions change
  useEffect(() => {
    console.log('Transactions updated:', transactions);
  }, [transactions]);

  const fetchMonthlyLimits = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      
      const response = await api.get(`/monthly-limit/user/${userId}?month=${month}&year=${year}`);
      if (response.data.status === 'OK') {
        const limitsObj = {};
        response.data.data.forEach(limit => {
          limitsObj[limit.category] = limit;
        });
        setMonthlyLimits(limitsObj);
      }
    } catch (error) {
      console.error('Error fetching monthly limits:', error);
    }
  };

  // Update remaining days
  useEffect(() => {
    const updateRemainingDays = () => {
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const days = Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
      setRemainingDays(days);
    };

    updateRemainingDays();
    const interval = setInterval(updateRemainingDays, 60000);
    return () => clearInterval(interval);
  }, []);

  const mapCategory = (category) => {
    // Map từ tiếng Anh sang tiếng Việt và ngược lại
    const categoryMap = {
      'food': 'Ăn uống',
      'transport': 'Di chuyển',
      'shopping': 'Mua sắm',
      'bills': 'Hóa đơn',
      'entertainment': 'Giải trí',
      'salary': 'Lương',
      'investment': 'Đầu tư',
      'other': 'Khác',
      // Thêm mapping ngược lại
      'ăn uống': 'food',
      'di chuyển': 'transport',
      'mua sắm': 'shopping',
      'hóa đơn': 'bills',
      'giải trí': 'entertainment',
      'lương': 'salary',
      'đầu tư': 'investment',
      'khác': 'other'
    };
    
    return categoryMap[category.toLowerCase()] || category;
  };

  const isSameCategory = (cat1, cat2) => {
    const mapped1 = mapCategory(cat1.toLowerCase());
    const mapped2 = mapCategory(cat2.toLowerCase());
    return mapped1 === mapped2 || mapped1 === cat2.toLowerCase() || mapped2 === cat1.toLowerCase();
  };

  const calculateRemainingBudget = (budget) => {
    try {
      // Lấy số tiền ngân sách
      const budgetAmount = parseFloat(budget.amount);
      console.log('Budget category:', budget.category);
      
      // Chuyển đổi ngày tháng budget sang UTC
      const startDate = new Date(budget.startDate);
      const endDate = new Date(budget.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      console.log('Budget period:', {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      });

      // Kiểm tra transactions
      if (!transactions || !Array.isArray(transactions)) {
        console.log('No transactions available');
        return budgetAmount;
      }

      // In ra các category độc nhất trong transactions
      const uniqueCategories = [...new Set(transactions.map(t => t.category))];
      console.log('Available categories in transactions:', uniqueCategories);

      // Tìm các giao dịch chi tiêu trong cùng danh mục và trong khoảng thời gian
      const expenses = transactions.filter(transaction => {
        const amount = parseFloat(transaction.amount);
        const isExpense = amount < 0;
        const isMatchingCategory = isSameCategory(transaction.category, budget.category);
        
        // Kiểm tra ngày tháng
        const transactionDate = new Date(transaction.date);
        transactionDate.setHours(0, 0, 0, 0);
        const isInDateRange = transactionDate >= startDate && transactionDate <= endDate;
        
        console.log('Checking transaction:', {
          transactionCategory: transaction.category,
          budgetCategory: budget.category,
          mappedTransaction: mapCategory(transaction.category),
          mappedBudget: mapCategory(budget.category),
          isMatching: isMatchingCategory,
          amount: amount,
          isExpense: isExpense,
          date: transactionDate.toISOString(),
          isInDateRange: isInDateRange
        });
        
        return isExpense && isMatchingCategory && isInDateRange;
      });

      console.log('Matching expenses:', expenses.map(e => ({
        amount: e.amount,
        date: new Date(e.date).toISOString(),
        category: e.category
      })));

      // Tính tổng chi tiêu
      const totalExpenses = expenses.reduce((total, expense) => {
        const amount = Math.abs(parseFloat(expense.amount));
        console.log('Adding expense:', {
          amount: amount,
          date: new Date(expense.date).toISOString()
        });
        return total + amount;
      }, 0);

      console.log('Total expenses:', totalExpenses);
      const remaining = budgetAmount - totalExpenses;
      console.log('Remaining amount:', remaining);

      return remaining;

    } catch (error) {
      console.error('Error calculating remaining budget:', error);
      return budget.amount;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'food':
      case 'Ăn uống':
        return 'Ăn uống';
      case 'transport':
      case 'Di chuyển':
        return 'Di chuyển';
      case 'shopping':
      case 'Mua sắm':
        return 'Mua sắm';
      case 'bills':
      case 'Hóa đơn':
        return 'Hóa đơn';
      case 'entertainment':
      case 'Giải trí':
        return 'Giải trí';
      case 'salary':
      case 'Lương':
        return 'Lương';
      case 'investment':
      case 'Đầu tư':
        return 'Đầu tư';
      case 'other':
      case 'Khác':
        return 'Khác';
      default:
        return 'Khác';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food':
      case 'Ăn uống':
        return 'utensils';
      case 'transport':
      case 'Di chuyển':
        return 'bus';
      case 'shopping':
      case 'Mua sắm':
        return 'shopping-bag';
      case 'bills':
      case 'Hóa đơn':
        return 'file-invoice-dollar';
      case 'entertainment':
      case 'Giải trí':
        return 'gamepad';
      case 'salary':
      case 'Lương':
        return 'money-bill-wave';
      case 'investment':
      case 'Đầu tư':
        return 'chart-line';
      case 'other':
      case 'Khác':
        return 'ellipsis-h';
      default:
        return 'ellipsis-h';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleEdit = (budget) => {
    navigate('/edit-budget', { state: { budget } });
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) {
      try {
        await dispatch(removeBudget(budgetId)).unwrap();
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (isError) {
    return <div className="error">Lỗi: {message}</div>;
  }

  return (
    <div className="budget-list-container">
      <div className="budget-list-header">
        <h2>Danh sách ngân sách</h2>
        <div className="header-right">
          <p className="remaining-days">Còn lại {remainingDays} ngày trong tháng</p>
          <button 
            className="add-budget-button"
            onClick={() => navigate('/create-budget')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="budget-grid">
        {budgets.map((budget) => {
          const remainingAmount = calculateRemainingBudget(budget);
          const isOverBudget = remainingAmount < 0;
          const percentageUsed = ((budget.amount - remainingAmount) / budget.amount) * 100;
          const monthlyLimit = monthlyLimits[budget.category];

          return (
            <div key={budget._id} className="budget-card">
              <div className="budget-icon">
                <FontAwesomeIcon icon={getCategoryIcon(budget.category)} />
              </div>
              <div className="budget-info">
                <h3>{getCategoryName(budget.category)}</h3>
                <p className="budget-amount">Ngân sách: {formatAmount(budget.amount)}</p>
                <p className={`remaining-amount ${isOverBudget ? 'over-budget' : ''}`}>
                  {isOverBudget ? 'Vượt ngân sách: ' : 'Còn lại: '}
                  {formatAmount(Math.abs(remainingAmount))}
                </p>
                {monthlyLimit && (
                  <p className="monthly-limit">
                    Giới hạn tháng: {formatAmount(monthlyLimit.limit)}
                    <br />
                    Đã dùng: {formatAmount(monthlyLimit.totalSpent || 0)}
                  </p>
                )}
                <div className="budget-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(percentageUsed, 100)}%`,
                      backgroundColor: isOverBudget ? '#ff4444' : '#4CAF50'
                    }}
                  />
                </div>
                <div className="budget-percentage">
                  {percentageUsed.toFixed(1)}% đã sử dụng
                </div>
                {budget.note && (
                  <div className="budget-note-tooltip">
                    {budget.note}
                  </div>
                )}
                <div className="budget-dates">
                  <span>{formatDate(budget.startDate)}</span>
                  <span> - </span>
                  <span>{formatDate(budget.endDate)}</span>
                </div>
              </div>
              <div className="budget-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(budget)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(budget._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetList;