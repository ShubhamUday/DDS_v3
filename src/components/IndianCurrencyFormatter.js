import React from 'react';
import MDTypography from './MDTypography';


const IndianCurrencyFormatter = ({ value }) => {

  const formattedValue = new Intl.NumberFormat('en-IN', {   
    currency: 'INR'
  }).format(value);

  return <MDTypography variant="body2" fontWeight="medium">₹ {formattedValue}</MDTypography>;
};

export default IndianCurrencyFormatter;
