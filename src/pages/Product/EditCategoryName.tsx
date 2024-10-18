import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from '../../redux/store';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField } from '@mui/material';
import { FaEdit } from "react-icons/fa";
import { editCategoryName } from "../../slices/categorySlice";
import { useSnackbar } from "notistack";

interface EditCategoryNameProps {
    id: string | undefined;
    nameId: string;
    value: string;
}

const EditCategoryName: React.FC<EditCategoryNameProps> = ({ id, nameId, value }) => {
    const [open, setOpen] = useState(false);
    const [editedValue, setEditedValue] = useState(value);
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setEditedValue(value);
    }, [value]);

    const handleSubmit = () => {
        if (id && nameId) {
            dispatch(editCategoryName({ id, nameId, newValue: editedValue }))
                .unwrap()
                .then((result) => {
                    if (result && result._id) {
                        enqueueSnackbar("Category name updated successfully!", {
                            variant: "success",
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        });
                        handleClose();
                    } else {
                        throw new Error('Invalid response from server');
                    }
                })
                .catch((error) => {
                    enqueueSnackbar(`Failed to update category name: ${error.message || error}`, {
                        variant: "error",
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    });
                });
        }
    };

    return (
        <div>
            <FaEdit onClick={handleOpen} />
            <Dialog open={open} maxWidth="sm" fullWidth sx={{ borderRadius: '15px' }}>
                <DialogTitle className='text-[24px] font-medium  text-black dark:text-white bg-white dark:bg-black'>
                    Edit Attribute Name
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
    )
}

export default EditCategoryName

