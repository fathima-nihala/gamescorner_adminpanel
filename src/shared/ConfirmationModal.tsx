import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface ConfirmationModalProps {
    delOpen: boolean;
    delHandleClose: () => void;
    onDelete: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ delOpen, delHandleClose, onDelete }) => {
    return (
        <Dialog open={delOpen} onClose={delHandleClose} maxWidth="xs" fullWidth>
            <DialogTitle className='bg-white dark:bg-black'>
                <div className='flex items-center justify-end text-black dark:text-white'>
                    <CloseIcon fontSize="large" onClick={delHandleClose} className='cursor-pointer ' />
                </div>
            </DialogTitle>
            <DialogContent className='bg-white dark:bg-black'>
                <div className='text-center text-black dark:text-white'>
                    <h2>Are you sure?</h2>
                    <p>Do you really want to delete these records? This process cannot be undone.</p>
                </div>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }} className='bg-white dark:bg-black'>
                <Button variant="outlined" onClick={delHandleClose} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button variant="contained" color="error" onClick={onDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
