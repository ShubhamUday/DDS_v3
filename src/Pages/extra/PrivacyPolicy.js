import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, List, ListItem, ListItemText } from '@mui/material';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const PrivacyPolicy = ({ isPrivacyModalOpen, setIsPrivacyModalOpen, handleMenuClose }) => {

    const handleClose = () => {
        setIsPrivacyModalOpen(false);
        handleMenuClose();
    }

    return (
        <>
            <Dialog open={isPrivacyModalOpen} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle> Privacy Policy </DialogTitle>
                <DialogContent dividers>
                    <MDBox mb={2}>
                        <MDTypography variant="h6" gutterBottom>
                            1. Information We Collect
                        </MDTypography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Personal Information"
                                    secondary="Name, email, address, phone number, and medical history."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Health Information"
                                    secondary="Medical records, prescriptions, and treatment history."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Device Information"
                                    secondary="IP address, device type, and operating system."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Usage Data"
                                    secondary="App interactions and preferences."
                                />
                            </ListItem>
                        </List>
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    <MDBox mb={2}>
                        <MDTypography variant="h6" gutterBottom>
                            2. How We Use Your Information
                        </MDTypography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="To provide and maintain our healthcare services." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="To communicate with you about appointments and updates." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="To comply with legal obligations." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="To protect the security of our users and services." />
                            </ListItem>
                        </List>
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    <MDBox mb={2}>
                        <MDTypography variant="h6" gutterBottom>
                            3. Information Sharing
                        </MDTypography>
                        <MDTypography variant="body2" gutterBottom>
                            We may share your information with:
                        </MDTypography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="Healthcare providers involved in your care." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Service providers who assist in our operations." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Legal authorities when required by law." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="With your explicit consent for other purposes." />
                            </ListItem>
                        </List>
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    <MDBox mb={2}>
                        <MDTypography variant="h6" gutterBottom>
                            4. Data Security
                        </MDTypography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="We implement industry-standard security." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Regular security assessments and updates." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Encrypted data transmission." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Secure storage of sensitive information." />
                            </ListItem>
                        </List>
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    <MDBox mb={2}>
                        <MDTypography variant="h6" gutterBottom>
                            5. Your Rights
                        </MDTypography>
                        <MDTypography variant="body2" gutterBottom>
                            You have the right to:
                        </MDTypography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="Access your personal information." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Correct inaccurate data." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Request deletion of your data." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Opt-out of marketing communications." />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="File a complaint about data handling." />
                            </ListItem>
                        </List>
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    <MDBox mb={2}>
                        <MDTypography variant="h6" gutterBottom>
                            6. Contact Us
                        </MDTypography>
                        <MDTypography variant="body2">
                            For any privacy-related questions or concerns:
                            <br />
                            <strong>Email:</strong> privacy@healthcareapp.com
                            <br />
                            <strong>Phone:</strong> +1-800-HEALTH
                            <br />
                            <strong>Address:</strong> 123, Healthcare Street, Medical City, MC 12345
                        </MDTypography>
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    <MDBox>
                        <MDTypography variant="h6" gutterBottom>
                            7. Updates to Privacy Policy
                        </MDTypography>
                        <MDTypography variant="body2">
                            We may update this privacy policy periodically. We will notify you of any
                            significant changes through the app or via email.
                        </MDTypography>
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleClose} color="primary">
                        Close
                    </MDButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PrivacyPolicy