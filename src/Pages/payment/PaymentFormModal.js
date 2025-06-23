import React, { useEffect, useState } from 'react';
import { TextField, FormControl, IconButton, Stack, ToggleButtonGroup, ToggleButton, Dialog, DialogContent, DialogTitle, } from '@mui/material';
import axios from 'axios';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { styled } from '@mui/material/styles';
import { CloseOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify';

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

function PaymentFormModal({ appointmentData, isPaymentUpdateModalOpen, setIsPaymentUpdateModalOpen, getDetails }) {
    const [status, setStatus] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [formData, setFormData] = useState({
        PayStatus: '',
        PayType: '',
        PayAmount: '',
    });

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        const values = formData

        try {
            const response = await axios.put(`${process.env.REACT_APP_HOS}/update-Appointment-Details/${appointmentData._id}`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("response data", response.data)
            if (response.data) {
                getDetails()
                toast.success("Payment is updated successfully")
                setIsPaymentUpdateModalOpen(false)
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Unable to update payment")
        }
    };

    useEffect(() => {
        const data = appointmentData
        setFormData({
            PayStatus: data?.PayStatus || '',
            PayType: data?.PayType || '',
            PayAmount: data?.PayAmount || '',
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

                    <Stack spacing={2}>
                        {/* Status */}
                        <FormControl fullWidth size="small">
                            <MDBox display="flex">
                                <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Status </MDTypography>

                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={formData.PayStatus}
                                    exclusive
                                    onChange={handleChange('PayStatus')}
                                >
                                    <StyledToggleButton value="Paid"> Paid </StyledToggleButton>
                                    <StyledToggleButton value="Pending"> Pending </StyledToggleButton>
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
                                    value={formData.PayType}
                                    exclusive
                                    onChange={handleChange('PayType')}
                                >
                                    <StyledToggleButton value="Case"> Cash </StyledToggleButton>
                                    <StyledToggleButton value="Online"> Online </StyledToggleButton>
                                </ToggleButtonGroup>
                            </MDBox>
                        </FormControl>

                        {/* Amount */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Amount"
                            type="number"
                            value={formData.PayAmount}
                            onChange={handleChange("PayAmount")}
                            sx={{
                                // For Chrome, Safari, Edge
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                                // For Firefox
                                '& input[type=number]': {
                                    MozAppearance: 'textfield',
                                },
                            }}
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