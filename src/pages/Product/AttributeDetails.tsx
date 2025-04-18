import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Grid,
    Typography,
    TextField,
    Box,
    Button,
    TablePagination
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addAttributeValue, deleteAttributeValue, fetchAttributes } from '../../slices/attributeSlice';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { AppDispatch, RootState } from '../../redux/store';
import EditAttributeValue from './EditAttributeValue';

const AttributeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const [delOpen, setDelOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<{ valueId: string } | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const [newValue, setNewValue] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const delHandleClose = () => setDelOpen(false);

    const handleDeleteClick = (valueId: string) => {
        setSelectedItem({ valueId });
        setDelOpen(true);
    };

    const onDelete = async () => {
        if (selectedItem && id) {
            try {
                await dispatch(deleteAttributeValue({ id, valueId: selectedItem.valueId })).unwrap();
                enqueueSnackbar("Attribute value deleted successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            } catch (error: any) {
                enqueueSnackbar(`Failed to delete attribute value: ${error.message}`, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            }
            setDelOpen(false);
        }
    };

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    const { attributes, loading, error: stateError } = useSelector((state: RootState) => state.attribute);

    const filteredAttribute = attributes.find(attr => attr._id === id);

    const paginatedValues = filteredAttribute
        ? filteredAttribute.value.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : [];

    const validateInput = (): boolean => {
        if (!newValue.trim()) {
            setError("Value is required");
            return false;
        }
        setError("");
        return true;
    };

    const handleFormSubmit = async () => {
        if (validateInput() && id) {
            try {
                await dispatch(addAttributeValue({ id, value: newValue })).unwrap();
                enqueueSnackbar("Attribute value added successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                setNewValue("");
            } catch (error: any) {
                enqueueSnackbar(error.message || "Failed to add attribute value.", { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            }
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (stateError) {
        return <Typography color="error">{stateError}</Typography>;
    }

    if (!filteredAttribute) {
        return <Typography>Attribute not found</Typography>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Attribute Detail</h1>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <h2 className="text-xl font-semibold mb-2">{filteredAttribute.name}</h2>
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
                                        <TableRow key={item._id}>
                                            <TableCell className="text-black dark:text-white">{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell className="text-black dark:text-white">{item.value}</TableCell>
                                            <TableCell align='center'>
                                                <IconButton size="small" style={{ color: '#4d087e' }}>
                                                    <EditAttributeValue
                                                        id={id}
                                                        valueId={item._id}
                                                        value={item.value}
                                                    />
                                                </IconButton>
                                                <IconButton size="small" style={{ color: '#EF4444' }} onClick={() => handleDeleteClick(item._id)}>
                                                    <FaTrash />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <Typography align="center">No attribute values found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredAttribute.value.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className="text-black dark:text-white bg-white dark:bg-black"
                        />
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                    <h2 className="text-xl font-semibold mb-2">Add New Attribute Value</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Attribute Name</label>
                        <input type="text" value={filteredAttribute.name}
                            readOnly className="mt-1 block w-full p-2 border rounded-md bg-gray-100" />
                    </div>
                    <TextField
                        fullWidth
                        label="Value"
                        variant="outlined"
                        id="value"
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        error={!!error}
                        helperText={error}
                        sx={{ mb: 2 }}
                        slotProps={{
                            input: {
                                className: "text-black dark:text-white border border-stroke dark:border-strokedark",
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFormSubmit}
                        >
                            Save
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
    );
}

export default AttributeDetails;