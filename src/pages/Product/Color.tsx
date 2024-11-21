import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { AppDispatch, RootState } from "../../redux/store";
import { deleteColor, addColor, getAllColors } from "../../slices/colorSlice";
import EditColor from "./EditColor";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

interface Color {
    _id: string;
    name: string;
    color_code: string;
}

const Color: React.FC = () => {
    const [newColor, setNewColor] = useState({
        name: "",
        color_code: "",
    });
    const [error, setError] = useState<{ name?: string; color_code?: string }>({});
    const { enqueueSnackbar } = useSnackbar();
    const [delOpen, setDelOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const { colors, loading, error: stateError } = useSelector((state: RootState) => state.color);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const brandsPerPage = 10;

    // Pagination logic
    const indexOfLastBrand = currentPage * brandsPerPage;
    const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
    const currentColors = colors.slice(indexOfFirstBrand, indexOfLastBrand);
    const totalPages = Math.ceil(colors.length / brandsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        dispatch(getAllColors());

    }, [dispatch]);

    useEffect(() => {
        if (stateError) {
            enqueueSnackbar(stateError, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        }
    }, [stateError, enqueueSnackbar]);

    const handleDeleteClick = (colorId: string) => {
        setSelectedItem(colorId);
        setDelOpen(true);
    };

    const handleEdit = (itemId: string) => {
        setSelectedItem(itemId);
    };

    const onDelete = () => {
        if (selectedItem) {
            dispatch(deleteColor(selectedItem))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("Color deleted successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                })
                .catch((error: any) => {
                    enqueueSnackbar(`Failed to delete color: ${error.message}`, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                });
            setDelOpen(false);
        }
    };

    const handleFormSubmit = () => {
        if (!newColor.name || !newColor.color_code) {
            setError({
                name: !newColor.name ? 'Name is required' : '',
                color_code: !newColor.color_code ? 'Color code is required' : '',
            });
            return;
        }
        dispatch(addColor(newColor))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Color added successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                setNewColor({ name: "", color_code: "" });
                setError({});
            })
            .catch((error: any) => {
                enqueueSnackbar(`Failed to add color: ${error.message}`, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Breadcrumb pageName="Colour" />

            <div className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
                <Box sx={{ p: 3 }}>
                    {/* <Typography variant="h5" gutterBottom>Colors</Typography> */}
                    <Box
                        sx={{
                            display: {
                                xs: 'block',
                                md: 'flex',
                            },
                        }}
                    >
                        <TableContainer
                            component={Paper}
                            className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                            sx={{
                                mr: 2,
                                width: '65%',
                                '@media (max-width: 834px)': {
                                    width: '100%',
                                },
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-black dark:text-white">#</TableCell>
                                        <TableCell className="text-black dark:text-white">Name</TableCell>
                                        <TableCell className="text-black dark:text-white">Colour Code</TableCell>
                                        <TableCell className="text-black dark:text-white">Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {colors && colors.length > 0 ? (
                                        currentColors.map((color, index) => (
                                            <TableRow key={color._id}>
                                                <TableCell className="text-black dark:text-white">{index + 1}</TableCell>
                                                <TableCell className="text-black dark:text-white">{color.name}</TableCell>
                                                <TableCell className="text-black dark:text-white">
                                                    <Chip label={color.color_code} size="small" sx={{ mr: 1, mb: 1 }} className="text-black dark:text-white" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex">
                                                        <IconButton size="small" color="success" onClick={() => handleEdit(color._id)}>
                                                            <EditColor id={color._id} />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(color._id)}>
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <Typography align="center">No colors found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center py-4 px-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <p>{`Page ${currentPage} of ${totalPages}`}</p>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </TableContainer>



                        <Box
                            sx={{
                                width: '35%',
                                '@media (max-width: 834px)': {
                                    width: '100%',
                                    marginTop: '8px',
                                },
                            }}
                        >
                            <Typography variant="h6" gutterBottom>Add New Colour</Typography>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                id="name"
                                type="text"
                                value={newColor.name}
                                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                error={!!error.name}
                                helperText={error.name}
                                slotProps={{
                                    input: {
                                        className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
                                    },
                                }} />
                            <TextField
                                fullWidth
                                label="Color Code"
                                variant="outlined"
                                id="color_code"
                                type="text"
                                value={newColor.color_code}
                                onChange={(e) => setNewColor({ ...newColor, color_code: e.target.value })}
                                error={!!error.color_code}
                                helperText={error.color_code}
                                slotProps={{
                                    input: {
                                        className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
                                    },
                                }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>


            </div>
            <ConfirmationModal
                delOpen={delOpen}
                delHandleClose={() => setDelOpen(false)}
                onDelete={onDelete}
            />
        </div>
    );
};

export default Color;
