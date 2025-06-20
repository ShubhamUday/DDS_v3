import React, { useState } from 'react'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

function Test() {
    const [formData, setFormData] = useState({
        name: '',
        time: '',
        food: '',
        medicineType: '',
        quantity: '',
        duration: '',
    });

    // Handlers
    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleToggleChange = (field) => (e, value) => {
        if (value !== null) {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    return (
        <>
            <DashboardLayout>
                <div>Test</div>
                <FormControl fullWidth>
                    <InputLabel id="select-label">Food</InputLabel>
                    <Select 
                        labelId="select-label"
                        id="demo-simple-select"
                        label="Food"
                        value={formData.food}
                        onChange={handleChange('food')}
                    >
                        <MenuItem value={'After'}>After</MenuItem>
                        <MenuItem value={'Before'}>Before</MenuItem>
                    </Select>
                </FormControl>

            </DashboardLayout>
        </>
    )
}


export default Test

