import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';

const categoryIcons = {
  food: { icon: faUtensils, label: 'Ăn uống' },
  transport: { icon: faBus, label: 'Di chuyển' },
  entertainment: { icon: faGamepad, label: 'Giải trí' },
  shopping: { icon: faShoppingBag, label: 'Mua sắm' },
  bills: { icon: faFileInvoiceDollar, label: 'Hóa đơn' },
  salary: { icon: faMoneyBillWave, label: 'Lương' },
  bonus: { icon: faStar, label: 'Thưởng' },
  investment: { icon: faChartLine, label: 'Đầu tư' },
  other: { icon: faEllipsisH, label: 'Khác' }
};

const CategoryIcon = ({ category }) => {
  const categoryData = categoryIcons[category];
  
  if (!categoryData) return null;

  return <FontAwesomeIcon icon={categoryData.icon} title={categoryData.label} />;
};

export const getCategoryLabel = (category) => {
  return categoryIcons[category]?.label || category;
};

export const categoryOptions = {
  all: Object.entries(categoryIcons).map(([value, { label }]) => ({
    value,
    label
  }))
};

export default CategoryIcon;
