// Import các thư viện và module cần thiết
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar, setUserData } from '../../features/userSlice';
import { fetchTransactions, setDateRange } from '../../features/transactionSlice';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './OverAll.css';
import { PieChart } from 'react-minimal-pie-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Thiết lập URL cơ sở cho các yêu cầu API
axios.defaults.baseURL = 'http://localhost:3001';

const OverAll = () => {
  // Khởi tạo các hook và trình quản lý trạng thái
  const dispatch = useDispatch();
  
  // Lấy thông tin người dùng từ Redux store
  const avatar = useSelector((state) => state.user.avatar);
  const userDataFromStore = useSelector((state) => state.user.userData);
  
  // Tạo bản sao của dữ liệu người dùng để tránh thay đổi trực tiếp
  const userData = useMemo(() => userDataFromStore || {}, [userDataFromStore]);
  
  // Lấy token xác thực
  const token = useSelector((state) => state.user.token);
  
  // Tham chiếu đến input file để tải avatar
  const fileInputRef = useRef(null);
  
  // Trạng thái đang lưu thông tin
  const [isSaving, setSaving] = useState(false);
  
  // Lấy khoảng ngày từ store
  const dateRange = useSelector((state) => state.transactions.dateRange);
  
  // Load thông tin người dùng khi component được mount
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        if (!token) return;
        
        // Giải mã token để lấy ID người dùng
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        
        console.log('Loading user details for userId:', userId);
        
        // Gửi yêu cầu lấy thông tin người dùng
        const response = await axios.get(`/api/user-details/get/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Raw response from server:', response);
        console.log('Loaded user details data:', response.data);
        console.log('User details data structure:', response.data.data);

        if (response.data && response.data.data) {
          const userDetails = response.data.data;
          console.log('Processing user details:', userDetails);
          
          // Định dạng ngày sinh thành YYYY-MM-DD cho input type="date"
          if (userDetails.birthdate) {
            const date = new Date(userDetails.birthdate);
            if (!isNaN(date.getTime())) {
              userDetails.birthdate = date.toISOString().split('T')[0];
            }
          }

          // Đảm bảo có thông tin quê quán
          const formattedUserDetails = {
            ...userDetails,
            hometown: userDetails.hometown || ''
          };
          
          console.log('Formatted user details before dispatch:', formattedUserDetails);
          dispatch(setUserData(formattedUserDetails));
          
          if (userDetails.avatar) {
            dispatch(setAvatar(userDetails.avatar));
          }
        }
      } catch (error) {
        console.error('Error loading user details:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    };

    loadUserDetails();
  }, [dispatch, token]);

  // Lấy giao dịch khi component được mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Lấy giao dịch từ store
  const transactions = useSelector((state) => state.transactions.transactions);

  // Xử lý thay đổi khoảng ngày
  const handleDateRangeChange = (type, value) => {
    dispatch(setDateRange({
      ...dateRange,
      [type]: value
    }));
  };

  // Lọc giao dịch theo khoảng ngày
  const filteredTransactions = transactions.filter(transaction => {
    if (!dateRange.startDate || !dateRange.endDate) return true;
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(dateRange.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Tính tổng thu và tổng chi
  const { totalIncome, totalExpense } = filteredTransactions.reduce((acc, transaction) => {
    const amount = parseFloat(transaction.amount);
    if (amount > 0) {
      acc.totalIncome += amount;
    } else {
      acc.totalExpense += Math.abs(amount);
    }
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });

  // Tính chi tiêu theo danh mục
  const spendingByCategory = filteredTransactions
    .filter(t => parseFloat(t.amount) < 0)  // Lọc giao dịch chi tiêu
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(parseFloat(transaction.amount));
      return acc;
    }, {});

  // Chuyển đổi dữ liệu chi tiêu cho biểu đồ
  const colors = ['#E38627', '#C13C37', '#6A2135', '#47B39C', '#6A4C93'];
  const defaultSpendingData = [
    { title: 'Ăn uống', value: 0, color: '#E38627' },
    { title: 'Di chuyển', value: 0, color: '#C13C37' },
    { title: 'Mua sắm', value: 0, color: '#6A2135' },
    { title: 'Giải trí', value: 0, color: '#47B39C' },
  ];

  let spendingData = Object.entries(spendingByCategory).map(([category, value], index) => ({
    title: category,
    value: parseFloat(value),
    color: colors[index % colors.length]
  }));

  // Nếu không có dữ liệu chi tiêu, sử dụng dữ liệu mặc định
  if (spendingData.length === 0) {
    spendingData = defaultSpendingData;
  }

  // Debug log
  console.log('Spending Data:', spendingData);

  useEffect(() => {
    // Debug log để xem token và userData
    console.log('Current token:', token);
    console.log('Current userData:', userData);
  }, [token, userData]);

  // Xử lý click vào avatar
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Xử lý thay đổi file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(setAvatar(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý thay đổi thông tin người dùng
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value:`, value);
    dispatch(setUserData({
      ...userData,
      [name]: value
    }));
  };

  // Xử lý lưu thông tin người dùng
  const handleSaveUserDetails = async () => {
    try {
      setSaving(true);
      
      if (!token) {
        alert('Bạn cần đăng nhập lại để thực hiện chức năng này');
        return;
      }

      // Giải mã token để lấy ID người dùng
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      
      if (!userId) {
        alert('Không tìm thấy thông tin người dùng');
        return;
      }

      // Tính tuổi từ ngày sinh
      const age = calculateAge(userData.birthdate);

      // Dữ liệu người dùng để gửi đến server
      const userDataToSend = {
        userId: userId,
        name: userData.name || '',
        hometown: userData.hometown || '',
        birthdate: userData.birthdate ? new Date(userData.birthdate).toISOString() : null,
        avatar: avatar || '',
        phone: userData.phone || '',
        age: age,
        email: userData.email || ''
      };

      console.log('Current userData state:', userData);
      console.log('Sending user data to server:', userDataToSend);
      
      // Gửi yêu cầu cập nhật thông tin người dùng
      const response = await axios.put(
        `/api/user-details/update/${userId}`,
        userDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server update response:', response.data);

      // Kiểm tra response có status OK
      if (response.data && response.data.status === 'OK') {
        console.log('Update successful, server returned:', response.data.data);
        
        // Đảm bảo dữ liệu được cập nhật đúng trong Redux store
        const updatedData = {
          ...response.data.data,
          birthdate: response.data.data.birthdate ? 
            new Date(response.data.data.birthdate).toISOString().split('T')[0] : null,
          hometown: response.data.data.hometown || ''
        };
        
        console.log('Updating Redux store with:', updatedData);
        dispatch(setUserData(updatedData));
        alert('Cập nhật thông tin thành công!');

        // Tải lại thông tin người dùng để đảm bảo dữ liệu đồng bộ
        console.log('Refreshing user data...');
        const refreshResponse = await axios.get(`/api/user-details/get/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Refresh response:', refreshResponse.data);

        if (refreshResponse.data && refreshResponse.data.status === 'OK') {
          const refreshedData = {
            ...refreshResponse.data.data,
            birthdate: refreshResponse.data.data.birthdate ? 
              new Date(refreshResponse.data.data.birthdate).toISOString().split('T')[0] : null,
            hometown: refreshResponse.data.data.hometown || ''
          };
          console.log('Final user data after refresh:', refreshedData);
          dispatch(setUserData(refreshedData));
        } else {
          console.error('Refresh failed:', refreshResponse.data);
        }
      } else {
        console.error('Update failed:', response.data);
        alert(response.data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error saving user details:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      if (error.response) {
        alert('Lỗi từ server: ' + error.response.data.message);
      } else if (error.request) {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        alert('Có lỗi xảy ra: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // Tính tuổi từ ngày sinh
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="overall-container">
      {/* Thẻ thông tin người dùng */}
      <div className="user-info-card">
        <div className="avatar-container" onClick={handleAvatarClick}>
          {avatar ? (
            <img src={avatar} alt="User avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <span>+</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <div className="user-details">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={userData.name || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="hometown"
            placeholder="Quê quán"
            value={userData.hometown || ''}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="birthdate"
            value={userData.birthdate || ''}
            onChange={handleInputChange}
          />
          <div className="age-display">
            Tuổi: {calculateAge(userData.birthdate) || 'Chưa có thông tin'}
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={userData.phone || ''}
            onChange={handleInputChange}
          />
          <button 
            onClick={handleSaveUserDetails}
            disabled={isSaving}
            className="save-button"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </div>

      {/* Thẻ tóm tắt giao dịch */}
      <div className="transaction-summary-card">
        <div className="summary-box">
          <h3>Tổng thu</h3>
          <p className="amount income">{totalIncome.toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className="summary-box">
          <h3>Tổng chi</h3>
          <p className="amount expense">{totalExpense.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>

      {/* Thẻ biểu đồ chi tiêu */}
      <div className="spending-chart-card">
        <div className="date-range-selector">
          <div className="date-input">
            <label>Từ ngày:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            />
          </div>
          <div className="date-input">
            <label>Đến ngày:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            />
          </div>
        </div>
        {spendingData.length > 0 && (
          <div className="chart-container">
            <div className="chart-box pie-chart-box">
              <div className="chart-title">Phân Bổ Chi Tiêu</div>
              <PieChart
                data={spendingData.filter(item => item.value > 0)}
                animate
                animationDuration={500}
                radius={45}
                lineWidth={60}
                startAngle={0}
                lengthAngle={360}
                paddingAngle={3}
                segmentsStyle={(index) => ({
                  transition: 'all .3s',
                  strokeWidth: 20
                })}
                label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                labelStyle={(index) => ({
                  fill: '#ffffff',
                  fontSize: '6px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold'
                })}
                labelPosition={70}
              />
              <div className="pie-chart-legend">
                {spendingData.filter(item => item.value > 0).map((data, index) => (
                  <div key={index} className="pie-legend-item">
                    <span 
                      className="color-box" 
                      style={{ backgroundColor: data.color }}
                    ></span>
                    <span>{data.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-box bar-chart-box">
              <div className="chart-title">Chi Tiết Chi Tiêu</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={spendingData.filter(item => item.value > 0)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="title" 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#FF9AA2" 
                    barSize={30}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverAll;