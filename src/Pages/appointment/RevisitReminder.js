import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { CloseOutlined } from '@mui/icons-material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'

const RevisitReminder = ({ isRevisitModalOpen, setIsRevisitModalOpen }) => {
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [formData, setFormData] = useState({
        doctorID: "",
        Bookdate: "",
    })

    const handleClose = () => {
        setIsRevisitModalOpen(false)
    }

    const handleSubmit = async () => {
        const values = formData

        try {
            const response = await axios.post(`${process.env.REACT_APP_HOS}/create-tdddicket`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("response data", response.data)
            if (response.data) {
                // getDetails()
                toast.success("Revisit set successfully")
                setIsRevisitModalOpen(false)
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Unable to set revisit")
        }
    };

    useEffect(() => {
    })

    const handleScheduleChange = (momentObj) => {

        console.log('DatePicker changed:', momentObj?.format("YYYY-MM-DD"));

        const formattedDate = momentObj.format('YYYY-MM-DD');

        if (!momentObj || !momentObj.isValid()) return;

        setFormData((prev) => ({
            ...prev,
            Bookdate: formattedDate,
        }));
        setShowTimePicker(true)
    };

    return (
        <>
            <Dialog open={isRevisitModalOpen} onClose={handleClose} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Revist Reminder </DialogTitle>
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

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                // disablePast
                                label="Schedule"
                                value={formData.Bookdate ? moment(formData.Bookdate) : null}
                                minDate={moment()} // today
                                // maxDate={moment().add(20, "days")} // today + 20 days
                                onChange={handleScheduleChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                    // error={submitAttempted && !formData.Bookdate}
                                    // helperText={submitAttempted && !formData.Bookdate && "Required"}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton variant="outlined" color="error" size="small" onClick={handleClose}>
                                Cancel
                            </MDButton>
                            <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}>
                                Set
                            </MDButton>
                        </MDBox>

                    </Stack>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default RevisitReminder