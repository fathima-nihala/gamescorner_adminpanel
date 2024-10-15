import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Box,
    TextField,
    Divider,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DropzoneImage from '../../shared/DropzoneImage';
import { AppDispatch } from '../../redux/store';
import { addBrand } from '../../slices/brandSlice';
import { useSnackbar } from 'notistack';


interface AddBrandsProps {
    open: boolean;
    handleClose: () => void;
    initialData?: { _id?: string; name: string; image: string };
}

const AddBrands: React.FC<AddBrandsProps> = ({ open, handleClose, initialData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [data, setData] = useState<{ name: string; image?: File | null }>({
        name: '',
        image: null,
    });
    const [error, setError] = useState<{ name?: string; image?: string }>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    // Reset form state when the modal is opened or initialData is updated
    useEffect(() => {
        if (open) {
            setData({
                name: initialData?.name || '',
                image: null,
            });
            setPreviewImage(initialData?.image || null);
            setError({});
        }
    }, [open, initialData]);

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setData((prev) => ({ ...prev, image: file }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async () => {
        const newErrors: { name?: string; image?: string } = {};

        if (!data.name) {
            newErrors.name = 'Name is required';
        }
        if (!data.image && !initialData?.image) {
            newErrors.image = 'Image is required';
        }

        setError(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image) {
            formData.append('image', data.image);
        }

        try {
            await dispatch(addBrand(formData));
            enqueueSnackbar('Brand Added successfully!', {
                variant: 'success', anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            handleClose();
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to Add Brand. Please try again.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    const closeDialog = () => {
        handleClose();
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth sx={{ borderRadius: '15px' }}>
            <DialogTitle className='text-[24px] font-medium bg-white dark:bg-black text-black dark:text-white'>
                Add Brand
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon className='text-black dark:text-white' />
                </IconButton>
            </DialogTitle>
            <Divider  />
            <DialogContent className='bg-white dark:bg-black text-black dark:text-white'>
                <Box component="form" noValidate autoComplete="off">
                    <h3 className='text-[15px]'>Name</h3>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="text"
                        fullWidth
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        error={!!error.name}
                        helperText={error.name}
                        sx={{
                            '& .MuiInputBase-root': {
                                backgroundColor: 'white',
                            },
                            
                            '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.6)',
                            },
                            '& .MuiInputBase-input': {
                                color: 'black',
                            },
                        }}
                    />
                    <div className='block w-full mt-4'>
                        <p>Image</p>
                        <DropzoneImage
                            onChange={handleFileInputChange}
                            image={previewImage}
                            id="brand-image"
                        />
                        {error.image && <Typography color="error">{error.image}</Typography>}
                    </div>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', paddingTop: "10px", paddingBottom: "20px" }} className='bg-white dark:bg-black text-black dark:text-white'>
                <Button
                    sx={{ backgroundColor: '#fa6800', '&:hover': { backgroundColor: '#fa6800' }, borderRadius: '10px' }}
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
                <Button
                    sx={{ color: '#fa6800', borderColor: '#fa6800', borderRadius: '10px', '&:hover': { borderColor: '#fa6800' } }}
                    variant="outlined" onClick={closeDialog}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBrands;
