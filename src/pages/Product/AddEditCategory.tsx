
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import DropzoneImage from '../../shared/DropzoneImage';
import { AppDispatch, RootState } from '../../redux/store';
import { addCategory, updateCategory } from '../../slices/categorySlice';

interface AddEditCategoryProps {
  mode: 'add' | 'edit';
  id?: string;
}

interface CategoryData {
  _id?: string;
  parent_category: string;
  image: File | null;
  icon: File | null;
  cover_image: File | null;
}

const AddEditCategory: React.FC<AddEditCategoryProps> = ({ mode, id }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<CategoryData>({
    parent_category: '',
    image: null,
    icon: null,
    cover_image: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);
  const [previewCoverImage, setPreviewCoverImage] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (mode === 'edit' && id && categories) {
      const categoryToEdit = categories.find((cat) => cat._id === id);
      if (categoryToEdit) {
        setData({
          _id: categoryToEdit._id,
          parent_category: categoryToEdit.parent_category,
          image: null,
          icon: null,
          cover_image: null,
        });
        setPreviewImage(categoryToEdit.image);
        setPreviewIcon(categoryToEdit.icon);
        setPreviewCoverImage(categoryToEdit.cover_image);
      }
    }
  }, [mode, id, categories]);


  const resetForm = () => {
    setData({
      parent_category: '',
      image: null,
      icon: null,
      cover_image: null,
    });
    setPreviewImage(null);
    setPreviewIcon(null);
    setPreviewCoverImage(null);
    setError({});
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    if (mode === 'edit' && id && categories) {
      const categoryToEdit = categories.find((cat) => cat._id === id);
      if (categoryToEdit) {
        setData({
          _id: categoryToEdit._id,
          parent_category: categoryToEdit.parent_category,
          image: null,
          icon: null,
          cover_image: null,
        });
        setPreviewImage(categoryToEdit.image);
        setPreviewIcon(categoryToEdit.icon);
        setPreviewCoverImage(categoryToEdit.cover_image);
      }
    } else {
      resetForm();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    key: keyof CategoryData
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
      setData({ ...data, [key]: file });
    }
  };

  const validateInput = () => {
    const validationErrors: Record<string, string> = {};
    if (!data.parent_category) validationErrors.parent_category = 'Parent category is required';
    if (mode === 'add') {
      if (!data.image) validationErrors.image = 'Image is required';
      if (!data.icon) validationErrors.icon = 'Icon is required';
      if (!data.cover_image) validationErrors.cover_image = 'Cover image is required';
    }
    setError(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateInput()) {
      try {
        const formData = new FormData();
        formData.append('parent_category', data.parent_category);
        if (data.image) formData.append('image', data.image);
        if (data.icon) formData.append('icon', data.icon);
        if (data.cover_image) formData.append('cover_image', data.cover_image);

        if (mode === 'add') {
          await dispatch(addCategory(formData));
          enqueueSnackbar('Category added successfully!', { variant: 'success' });
        } else if (mode === 'edit' && id) {
          await dispatch(updateCategory({ id, formData }));
          enqueueSnackbar('Category updated successfully!', { variant: 'success' });
        }
        handleClose();
      } catch (error) {
        enqueueSnackbar('Failed to process category.', { variant: 'error' });
      }
    }
  };

  const onFieldChange = (key: keyof CategoryData, value: string | string[] | File | null) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
    setError((prevError) => ({ ...prevError, [key]: '' }));
  };

  return (
    <div>
      {mode === 'add' ? (
        <Button onClick={handleOpen}
          sx={{
            backgroundColor: '#3B82F6',
            color: 'white',
            paddingY: '8px',
            paddingX: '32px',
            borderRadius: '8px',
          }}
        >Add</Button>
      ) : (
        <span onClick={handleOpen} className="flex cursor-pointer">
          <EditIcon className="mr-2" />
          <ListItemText primary="Edit" />
        </span>
      )}

      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle className='text-black dark:text-white bg-white dark:bg-black'>
          {mode === 'add' ? 'Add Category' : 'Edit Category'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon className='text-black dark:text-white' />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent className='bg-white dark:bg-black text-black dark:text-white'>
          <Box component="form" autoComplete="off">
            <Typography variant="subtitle1">Parent Category</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="parent_category"
              type="text"
              fullWidth
              value={data.parent_category}
              onChange={(e) => onFieldChange('parent_category', e.target.value)}
              error={!!error.parent_category}
              helperText={error.parent_category}
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
            <div className="flex gap-4 mt-4">
              <div className="block w-full">
                <Typography variant="body2">Image (212×101)</Typography>
                <DropzoneImage
                  onChange={(e) => handleFileChange(e, setPreviewImage, 'image')}
                  image={previewImage}
                  id={data._id ? `image-${data._id}` : 'new-image'}
                />
                {error.image && <Typography color="error">{error.image}</Typography>}
              </div>

              <div className="block w-full">
                <Typography variant="body2">Icon (25×25)</Typography>
                <DropzoneImage
                  onChange={(e) => handleFileChange(e, setPreviewIcon, 'icon')}
                  image={previewIcon}
                  id={data._id ? `icon-${data._id}` : 'new-icon'}
                />
                {error.icon && <Typography color="error">{error.icon}</Typography>}
              </div>
            </div>

            <div className="block w-full mt-4">
              <Typography variant="body2">Cover Image</Typography>
              <DropzoneImage
                onChange={(e) => handleFileChange(e, setPreviewCoverImage, 'cover_image')}
                image={previewCoverImage}
                id={data._id ? `cover-image-${data._id}` : 'new-cover-image'}
              />
              {error.cover_image && <Typography color="error">{error.cover_image}</Typography>}
            </div>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', py: 2 }} className='bg-white dark:bg-black text-black dark:text-white'>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            sx={{ backgroundColor: '#fa6800', '&:hover': { backgroundColor: '#fa6800' }, borderRadius: '10px' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEditCategory;


