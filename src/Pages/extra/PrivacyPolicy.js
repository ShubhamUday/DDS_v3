import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const PrivacyPolicy = ({ isPrivacyModalOpen, setIsPrivacyModalOpen, handleMenuClose }) => {
    return (
        <>
            <Dialog open={isPrivacyModalOpen} onClose={() => { setIsPrivacyModalOpen(false); handleMenuClose() }} maxWidth="md" fullWidth>
                <DialogTitle> Privacy Policy </DialogTitle>
                <DialogContent dividers>
                    <MDBox p={1}>
                        <MDTypography variant="body2" paragraph>
                            This is where your privacy policy content will go. You can outline how data is collected,
                            stored, shared, and any rights users have. Be sure to include sections like:
                        </MDTypography>
                        <MDTypography variant="body2" component="ul">
                            <li>What data you collect</li>
                            <li>How you use the data</li>
                            <li>Third-party services involved</li>
                            <li>How users can request deletion</li>
                            <li>Contact information</li>
                        </MDTypography>
                        <MDTypography variant="body2" paragraph sx={{ mt: 2 }}>
                            For any questions about our privacy practices, please contact us at support@example.com.
                        </MDTypography>
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={() => { setIsPrivacyModalOpen(false); handleMenuClose() }} color="primary">
                        Close
                    </MDButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PrivacyPolicy