import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addCategoryName, deleteCategoryName, fetchCategoryById } from "../../slices/categorySlice";
import { useSnackbar } from "notistack";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Typography, TextField,
    Box, Button, TablePagination, Grid
} from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import ConfirmationModal from "../../shared/ConfirmationModal";
import { AppDispatch, RootState } from '../../redux/store';
import EditCategoryName from "./EditCategoryName";

interface SelectedItem {
    itemId: string;
    index: number;
}

interface Category {
    _id: string;
    parent_category: string;
    name: string[];
}

const CategoryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();

    const [delOpen, setDelOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
    const [data, setData] = useState<{ name: string }>({ name: "" });
    const [error, setError] = useState<{ name?: string }>({});
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const delHandleClose = () => setDelOpen(false);

    const handleDeleteClick = (itemId: string, index: number) => {
        setSelectedItem({ itemId, index });
        setDelOpen(true);
    };

    const onDelete = () => {
        if (selectedItem && id) {
            const { index } = selectedItem;
            dispatch(deleteCategoryName({ id, index }))
                .then(() => {
                    enqueueSnackbar("Category name deleted successfully!", { variant: "success" , anchorOrigin: { vertical: 'top', horizontal: 'right' },});
                })
                .catch((error: Error) => {
                    enqueueSnackbar(`Failed to delete category name: ${error.message}`, { variant: "error" , anchorOrigin: { vertical: 'top', horizontal: 'right' },});
                });
            setDelOpen(false);
        }
    };

    // Get categories from Redux store directly
    const { categories, loading, error: fetchError } = useSelector((state: RootState) => state.category);


    useEffect(() => {
        if (id) {
            dispatch(fetchCategoryById(id));
        }
    }, [dispatch, id]);
    
    console.log('Categories:', categories);


    // Filter parent categories by ID
    const filterParentCat: Category[] = Array.isArray(categories)
        ? categories.filter((category: Category) => category._id === id)
        : [];

    // Handle paginated category names
    const paginatedValues = filterParentCat.length > 0 && filterParentCat[0]?.name?.length > 0
        ? filterParentCat[0].name.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : [];

    // Input validation
    const validateInput = () => {
        const validationErrors: { name?: string } = { name: data.name ? "" : "Name is required" };
        setError(validationErrors);
        return Object.values(validationErrors).every(value => !value);
    };

    // Handle form submission
    const handleFormSubmit = async () => {
        if (validateInput() && id) {
            try {
                await dispatch(addCategoryName({ id, name: data.name }));
                enqueueSnackbar("Category name added successfully!", { variant: "success" , anchorOrigin: { vertical: 'top', horizontal: 'right' },});
                setData({ name: "" });
            } catch (error: any) {
                enqueueSnackbar(error.message || "Failed to add category name.", { variant: "error" , anchorOrigin: { vertical: 'top', horizontal: 'right' },});
            }
        }
    };

    // Handle field change
    const onFieldChange = (key: keyof typeof data, value: string) => {
        setData((prevData) => ({ ...prevData, [key]: value }));
        setError((prevError) => ({ ...prevError, [key]: "" }));
    };

    // Handle page change
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <Typography align="center">Loading categories...</Typography>;
    }

    if (fetchError) {
        return <Typography align="center" color="error">Failed to load categories: {fetchError}</Typography>;
    }

    return (
        <div>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Category Detail</h1>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <h2 className="text-xl font-semibold mb-2">
                            {filterParentCat[0]?.parent_category || 'No Category'}
                        </h2>
                        <TableContainer component={Paper} sx={{ width: '100%' }} className="text-black dark:text-white bg-white dark:bg-black">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-black dark:text-white">#</TableCell>
                                        <TableCell className="text-black dark:text-white">Value</TableCell>
                                        <TableCell align='center' className="text-black dark:text-white">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedValues.length > 0 ? (
                                        paginatedValues.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-black dark:text-white">{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell className="text-black dark:text-white">{item}</TableCell>
                                                <TableCell align='center'>
                                                <IconButton size="small" style={{ color: '#4d087e' }}>
                                                    <EditCategoryName
                                                        id={id}
                                                        index={index}
                                                        value={item}
                                                    />
                                                </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        style={{ color: '#EF4444' }}
                                                        onClick={() => handleDeleteClick(filterParentCat[0]._id, page * rowsPerPage + index)}
                                                    >
                                                        <FaTrash />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <Typography align="center" className="text-black dark:text-white">No category names found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15]}
                                component="div"
                                count={filterParentCat[0]?.name?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                className="text-black dark:text-white bg-white dark:bg-black"
                            />
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <h2 className="text-xl font-semibold mb-2">Add Category Name</h2>
                        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                            <TextField
                                label="Name"
                                value={data.name}
                                onChange={(e) => onFieldChange('name', e.target.value)}
                                error={!!error.name}
                                helperText={error.name}
                                fullWidth
                                margin="normal"

                                sx={{
                                    '& .MuiInputBase-root': {
                                        backgroundColor:  '#f6f0f0',
                                    },
                                    
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(0, 0, 0, 0.6)',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'black',
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFormSubmit}
                                fullWidth
                            >
                                Add Category Name
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <ConfirmationModal
                    delOpen={delOpen}
                    delHandleClose={delHandleClose}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
};

export default CategoryDetails;


