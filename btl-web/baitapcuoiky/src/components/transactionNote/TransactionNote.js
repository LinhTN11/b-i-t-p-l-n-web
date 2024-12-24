import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTransaction, editTransaction, fetchTransactions } from '../../features/transactionSlice';
import './TransactionNote.css';

const TransactionNote = ({ onClose, editingTransaction }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toLocaleDateString('en-CA'), // Format YYYY-MM-DD
    note: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      // Khi cập nhật, sử dụng ngày từ giao dịch đang edit
      const transactionDate = new Date(editingTransaction.date);
      const formattedDate = transactionDate.toLocaleDateString('en-CA'); // Format YYYY-MM-DD
      setFormData({
        amount: editingTransaction.amount,
        category: editingTransaction.category || '',
        date: formattedDate,
        note: editingTransaction.note || ''
      });
    } else {
      // Khi tạo mới, sử dụng ngày hiện tại
      setFormData({
        amount: '',
        category: '',
        date: new Date().toLocaleDateString('en-CA'), // Format YYYY-MM-DD
        note: ''
      });
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Giữ nguyên thời gian từ giao dịch cũ nếu đang cập nhật
    let finalDate;
    if (editingTransaction) {
      const oldDate = new Date(editingTransaction.date);
      const [year, month, day] = formData.date.split('-');
      finalDate = new Date(
        year, 
        month - 1, 
        day,
        oldDate.getHours(),
        oldDate.getMinutes(),
        oldDate.getSeconds()
      );
    } else {
      const now = new Date();
      const [year, month, day] = formData.date.split('-');
      finalDate = new Date(
        year,
        month - 1,
        day,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );
    }

    // Chuyển đổi sang UTC để tránh vấn đề múi giờ
    const utcDate = new Date(Date.UTC(
      finalDate.getFullYear(),
      finalDate.getMonth(),
      finalDate.getDate(),
      finalDate.getHours(),
      finalDate.getMinutes(),
      finalDate.getSeconds()
    ));

    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: utcDate.toISOString(),
      id: editingTransaction ? editingTransaction.id : undefined
    };

    try {
      if (editingTransaction) {
        await dispatch(editTransaction({ 
          id: editingTransaction.id, 
          data: newTransaction 
        })).unwrap();
      } else {
        await dispatch(createTransaction(newTransaction)).unwrap();
      }
      
      await dispatch(fetchTransactions());
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  return (
    <div className="transaction-note-overlay">
      <div className="transaction-note">
        <div className="note-header">
          <h2>{editingTransaction ? 'Sửa giao dịch' : 'Ghi chép giao dịch'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số tiền</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Nhập số tiền (dương: thu nhập, âm: chi tiêu)"
              required
            />
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn danh mục</option>
              <option value="salary">Lương</option>
              <option value="bonus">Thưởng</option>
              <option value="investment">Đầu tư</option>
              <option value="food">Ăn uống</option>
              <option value="transport">Di chuyển</option>
              <option value="entertainment">Giải trí</option>
              <option value="shopping">Mua sắm</option>
              <option value="bills">Hóa đơn</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày giao dịch</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Nhập ghi chú"
              rows="3"
            />
          </div>

          <button type="submit" className="submit-button">
            {editingTransaction ? 'Cập nhật' : 'Lưu giao dịch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionNote;