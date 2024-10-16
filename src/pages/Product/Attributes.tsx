import React, { useEffect, useState } from "react";
import {
    Card,
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
import { Settings, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addAttribute, deleteAttribute, fetchAttributes } from "../../slices/attributeSlice";
import { useSnackbar } from "notistack";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import EditAttributeName from "./EditAttributeName";



const Attributes: React.FC = () => {
    const [data, setData] = useState<{ name: string; value?: string[] }>({ name: "" });
    const [error, setError] = useState<{ name?: string }>({});
    const { enqueueSnackbar } = useSnackbar();
    const [delOpen, setDelOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const { attributes, loading, error: stateError } = useSelector((state: RootState) => state.attribute);

    const delHandleClose = () => {
        setDelOpen(false);
    };

    const handleDeleteClick = (itemId: string) => {
        setSelectedItem(itemId);
        setDelOpen(true);
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item); 
    }

    const onDelete = () => {
        if (selectedItem) {
            dispatch(deleteAttribute(selectedItem))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("Attribute deleted successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                })
                .catch((error: any) => {
                    enqueueSnackbar(`Failed to delete attribute: ${error.message}`, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                });
            setDelOpen(false);
        }
    };

    const validateInput = () => {
        const validationErrors = {
            name: data.name ? "" : "Name is required",
        };

        setError(validationErrors);
        return Object.values(validationErrors).every((value) => !value);
    };

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    useEffect(() => {
        if (stateError) {
            enqueueSnackbar(stateError, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        }
    }, [stateError, enqueueSnackbar]);

    const handleFormSubmit = async () => {
        if (validateInput()) {
            const formData = {
                name: data.name,
                value: data.value || [],
            };

            try {
                await dispatch(addAttribute(formData)).unwrap();
                enqueueSnackbar("Attribute added successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                setData({ name: "" });
            } catch (error: any) {
                enqueueSnackbar(error.message || "Failed to add attribute.", { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            }
        }
    };

    const onFieldChange = (key: keyof typeof data, value: string) => {
        setData((prevData) => ({ ...prevData, [key]: value }));
        setError((prevError) => ({ ...prevError, [key]: "" }));
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
            <Card sx={{ my: 5, px: 5, py: 4, mx: 5 }} className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>All Attributes</Typography>
                    <Box display="flex" >
                        <TableContainer component={Paper} sx={{ width: '65%', mr: 2 }} className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-black dark:text-white">#</TableCell>
                                        <TableCell className="text-black dark:text-white">Name</TableCell>
                                        <TableCell className="text-black dark:text-white">Values</TableCell>
                                        <TableCell className="text-black dark:text-white">Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attributes && attributes.length > 0 ? (
                                        attributes.map((attr, index) => (
                                            <TableRow key={attr._id}>
                                                <TableCell className="text-black dark:text-white">{index + 1}</TableCell>
                                                <TableCell className="text-black dark:text-white">{attr.name}</TableCell>
                                                <TableCell>
                                                    {attr.value && attr.value.map((value: string, idx: number) => (
                                                        <Chip key={`${attr._id}-${idx}`} label={value} size="small" sx={{ mr: 1, mb: 1 }} className="text-black dark:text-white" />
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex">
                                                        <IconButton size="small" color="default">
                                                            <Link to={`/dashboard/attribute-details/${attr._id}`}>
                                                                <Settings fontSize="small" className="text-black dark:text-white" />
                                                            </Link>
                                                        </IconButton>

                                                        <IconButton size="small" color="success" onClick={() => handleEdit(attr._id)}>
                                                            <EditAttributeName id={attr._id}/>
                                                        </IconButton>
                                                      
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(attr._id)}>
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <Typography align="center">No attributes found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ width: '35%' }}>
                            <Typography variant="h6" gutterBottom>Add New Attribute</Typography>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => onFieldChange("name", e.target.value)}
                                error={!!error.name}
                                helperText={error.name}
                                sx={{
                                    mb: 2,
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
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleFormSubmit}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>
            <ConfirmationModal
                delOpen={delOpen}
                delHandleClose={delHandleClose}
                onDelete={onDelete}
            />
        </div>
    );
};

export default Attributes;
