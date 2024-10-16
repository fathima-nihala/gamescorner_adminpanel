
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { editAttributeValue } from '../../slices/attributeSlice';
import { AppDispatch } from '../../redux/store';

interface EditAttributeValueProps {
    id: string | undefined;
    index: number;
    value: string;
}

const EditAttributeValue: React.FC<EditAttributeValueProps> = ({ id, index, value }) => {
    const [open, setOpen] = useState(false);
    const [editedValue, setEditedValue] = useState(value);
    const dispatch = useDispatch<AppDispatch>();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setEditedValue(value);
    }, [value]);

    const handleSubmit = () => {
        if (id) {
            dispatch(editAttributeValue({ id, index, newValue: editedValue }))
                .unwrap()
                .then(() => {
                    handleClose();
                })
                .catch((error: string) => {
                    console.error('Failed to update attribute value:', error);
                });
        }
    };

    return (
        <div>
            <FaEdit onClick={handleOpen} />
            <Dialog open={open} maxWidth="sm" fullWidth sx={{ borderRadius: '15px' }}>
                <DialogTitle className='text-[24px] font-medium  text-black dark:text-white bg-white dark:bg-black'>
                    Edit Value
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent className="bg-white dark:bg-black text-black dark:text-white">
                    <Box component="form" autoComplete="off">
                        <h3 className='text-[15px]'>Value</h3>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="value"
                            type="text"
                            fullWidth
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{ display: 'flex', justifyContent: 'center', paddingTop: "10px", paddingBottom: "20px" }}
                    className="bg-white dark:bg-black text-black dark:text-white"
                >
                    <Button
                        sx={{ backgroundColor: '#fa6800', '&:hover': { backgroundColor: '#fa6800' }, borderRadius: '10px' }}
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                    <Button
                        sx={{ color: '#fa6800', borderColor: '#fa6800', borderRadius: '10px', '&:hover': { borderColor: '#fa6800' } }}
                        variant="outlined" onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditAttributeValue;