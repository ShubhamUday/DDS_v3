import React, { useEffect, useState } from 'react';
import { Modal, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Stack, ToggleButtonGroup, ToggleButton, } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from 'axios';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function PaymentFormModal({ selectedPayment, isPaymentUpdateModalOpen, setIsPaymentUpdateModalOpen, style }) {
    const [status, setStatus] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [formData, setFormData] = useState({
        status: '',
        transaction_type: '',
        amount: '',
    });


    const handleUpdate = async () => {
        try {
            const payload = {
                status,
                transactionType,
                amount,
            };

            await axios.put(`/api/appointments/${appointmentId}/payment`, payload);

            alert('Payment updated successfully!');
            handleClose();
        } catch (error) {
            console.error('Payment update failed:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        const data = selectedPayment
        setFormData({
            status: data?.PayStatus || '',
            transaction_type: data?.PayType || '',
            amount: data?.PayAmount || '',
        });

    },[])
    return (
        <>
            <Modal open={isPaymentUpdateModalOpen} onClose={() => { setIsPaymentUpdateModalOpen(false) }}>
                <MDBox sx={style}>
                    <MDTypography variant="h6" mb={2} fontWeight="bold"> Update Payment Details </MDTypography>

                    <Stack spacing={2}>
                        {/* Status */}
                        <FormControl fullWidth size="small">
                            <MDBox display="flex">
                                <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Status </MDTypography>

                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={formData.status}
                                    exclusive
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <ToggleButton value="Paid">Paid</ToggleButton>
                                    <ToggleButton value="Pending">Pending</ToggleButton>
                                </ToggleButtonGroup>
                            </MDBox>
                        </FormControl>

                        {/* Transaction Type */}
                        <FormControl fullWidth size="small">
                            <MDBox display="flex">
                                <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Transaction Type </MDTypography>
                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={formData.transaction_type}
                                    exclusive
                                    onChange={(e) => setTransactionType(e.target.value)}
                                >
                                    <ToggleButton value="Case">Cash</ToggleButton>
                                    <ToggleButton value="Online">Online</ToggleButton>
                                </ToggleButtonGroup>
                            </MDBox>
                        </FormControl>

                        {/* Amount */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        {/* Action Buttons */}
                        <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton variant="outlined" color="error" size="small" onClick={() => { setIsPaymentUpdateModalOpen(false) }}>
                                Cancel
                            </MDButton>
                            <MDButton variant="contained" color="success" size="small" onClick={handleUpdate}>
                                Save
                            </MDButton>
                        </MDBox>

                    </Stack>
                </MDBox>
            </Modal>
        </>

    )
}

export default PaymentFormModal