import api from './api';

// Lấy tất cả ngân sách của người dùng
const getAllBudgets = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return [];
    }
    const response = await api.get(`/budgets?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
};

// Tạo ngân sách mới
const createBudget = async (budgetData) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response = await api.post('/budgets', {
      ...budgetData,
      userId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cập nhật ngân sách
const updateBudget = async (id, budgetData) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response = await api.put(`/budgets/${id}`, {
      ...budgetData,
      userId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Xóa ngân sách
const deleteBudget = async (id) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const response = await api.delete(`/budgets/${id}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const budgetService = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};

export default budgetService;
