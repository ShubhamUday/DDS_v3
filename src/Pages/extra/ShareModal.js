import React from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from '@mui/material'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import { CloseOutlined } from '@mui/icons-material';


const ShareModal = ({ isShareModalOpen, setIsShareModalOpen, handleMenuClose }) => {
    const shareUrl = window.location.href;

    const handleClose=()=>{
        setIsShareModalOpen(false);
        handleMenuClose()
    }
    return (
        <>
            <Dialog open={isShareModalOpen} onClose={handleClose}>
                <DialogTitle> Share with Friends </DialogTitle>
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
                    <TextField
                        fullWidth
                        value={window.location.href}
                        InputProps={{
                            endAdornment: (
                                <MDButton onClick={() => navigator.clipboard.writeText(window.location.href)}>
                                    Copy
                                </MDButton>
                            ),
                        }}
                    />

                    <MDBox display="flex" justifyContent="space-between" gap={2} mt={1}>
                        <Tooltip title="WhatsApp">
                            <IconButton
                                component="a"
                                href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <WhatsAppIcon color="success" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Facebook">
                            <IconButton
                                component="a"
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FacebookIcon color="primary" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Gmail">
                            <IconButton
                                component="a"
                                href={`mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <EmailIcon color="error" />
                            </IconButton>
                        </Tooltip>
                    </MDBox>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default ShareModal