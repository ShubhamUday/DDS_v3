import React, { useEffect, useState } from 'react'
import { TextField, FormControl, IconButton, Stack, ToggleButtonGroup, ToggleButton, Dialog, DialogContent, DialogTitle, Grid, } from '@mui/material';
import axios from 'axios';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { CloseOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify';

const AddTicketModal = ({ ticketData, isTicketModalOpen, setIsTicketModalOpen, handleMenuClose, getDetails }) => {
    const [formData, setFormData] = useState({
        title: "",
        discription: "",
    })

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setIsTicketModalOpen(false);
        handleMenuClose();
        console.log("close")
    }

    const handleSubmit = async () => {
        const values = formData

        try {
            const response = await axios.post(`${process.env.REACT_APP_HOS}/create-ticket`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("response data", response.data)
            if (response.data) {
                // getDetails()
                toast.success("Ticket added successfully")
                setIsTicketModalOpen(false)
                handleMenuClose()
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Unable to add a ticket")
        }
    };

    useEffect(() => {
        // setFormData({
        //     title: "",
        //     discription: "",
        // })
    })
    
    return (
        <>
            <Dialog open={isTicketModalOpen} onClose={handleClose} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Add Ticket </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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

                        <Grid item xs={12} sm={12}>
                            <TextField fullWidth label="Title" size="small"
                                placeholder="Enter title here..."
                                value={formData.title}
                                onChange={handleChange('title')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField fullWidth label="Discription" size="small"
                                multiline
                                rows={2}
                                placeholder='Describe about suggestion or problem'
                                value={formData.discription}
                                onChange={handleChange('discription')}
                            />
                        </Grid>

                        {/* Action Buttons */}
                        <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton variant="outlined" color="error" size="small" onClick={handleClose}>
                                Cancel
                            </MDButton>
                            <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}>
                                Add Ticket
                            </MDButton>
                        </MDBox>

                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddTicketModal