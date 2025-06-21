import React, { useEffect, useState } from 'react';
import { TextField, FormControl, IconButton, Stack, ToggleButtonGroup, ToggleButton, Dialog, DialogContent, DialogTitle, } from '@mui/material';
import axios from 'axios';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@mui/icons-material'

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    textTransform: "capitalize",
    borderRadius: 8,
    fontWeight: 500,
    borderColor: "#cfd8dc",
    '&.Mui-selected': {
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#43a047',
        },
    },
}));

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

    }, [])
    return (
        <>
            <Dialog open={isPaymentUpdateModalOpen} onClose={() => { setIsPaymentUpdateModalOpen(false) }} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Update Payment Details </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => { setIsPaymentUpdateModalOpen(false) }}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseOutlined />
                </IconButton>
                <DialogContent>
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
                                    <StyledToggleButton value="Paid">Paid</StyledToggleButton>
                                    <StyledToggleButton value="Pending">Pending</StyledToggleButton>
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
                                    <StyledToggleButton value="Case">Cash</StyledToggleButton>
                                    <StyledToggleButton value="Online">Online</StyledToggleButton>
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
                </DialogContent>
            </Dialog>
        </>

    )
}

export default PaymentFormModal