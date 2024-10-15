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
} from "@mui/material";
import { Settings, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addAttribute, deleteAttribute, fetchAttributes } from "../../slices/attributeSlice";
import { useSnackbar } from "notistack";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { Link } from "react-router-dom";

// Define types for attributes
interface Attribute {
    _id: string;
    name: string;
    value: string[];
}

interface RootState {
    attributeState: {
        attribute: {
            attribute: Attribute[];
            paginationInfo: {
                currentPage: number;
                rowsPerPage: number;
            };
        };
    };
}

const Attributes: React.FC = () => {
    const [data, setData] = useState<{ name: string; value?: string[] }>({ name: "" });
    const [error, setError] = useState<{ name?: string }>({});
    const { enqueueSnackbar } = useSnackbar();
    const [delOpen, setDelOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const dispatch = useDispatch();

    const delHandleClose = () => {
        setDelOpen(false);
    };

    const handleDeleteClick = (itemId: string) => {
        setSelectedItem(itemId);
        setDelOpen(true);
    };

    const onDelete = () => {
        if (selectedItem) {
            dispatch(deleteAttribute(selectedItem) as any)
                .unwrap()
                .then(() => {
                    enqueueSnackbar("Attribute deleted successfully!", { variant: "success" });
                })
                .catch((error: any) => {
                    enqueueSnackbar(`Failed to delete attribute: ${error.message}`, { variant: "error" });
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
        dispatch(fetchAttributes() as any);
    }, [dispatch]);

    // const { attribute } = useSelector((state: RootState) => state.attributeState);
    const { attribute } = useSelector((state: RootState) => state.attributes || {});

    const attributePagination = attribute?.paginationInfo;

    const currentPage = attributePagination?.currentPage || 1;
    const rowsPerPage = attributePagination?.rowsPerPage || 10;

    const handleFormSubmit = async () => {
        if (validateInput()) {
            // Instead of FormData, create an object matching the expected structure
            const formData = {
                name: data.name,
                value: data.value || [], // Add default value if needed
            };

            try {
                await dispatch(addAttribute(formData) as any);
                enqueueSnackbar("Attribute added successfully!", { variant: "success" });
                setData({ name: "" });
            } catch (error: any) {
                enqueueSnackbar(error.message || "Failed to add attribute.", { variant: "error" });
            }
        }
    };

    const onFieldChange = (key: keyof typeof data, value: string) => {
        setData((prevData) => ({ ...prevData, [key]: value }));
        setError((prevError) => ({ ...prevError, [key]: "" }));
    };

    return (
        <div>
            <Card sx={{ my: 5, px: 5, py: 4, mx: 5 }}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>All Attributes</Typography>
                    <Box display="flex">
                        <TableContainer component={Paper} sx={{ width: '65%', mr: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Values</TableCell>
                                        <TableCell>Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attribute?.attribute && attribute.attribute.length > 0 ? (
                                        attribute.attribute.map((attr, index) => (
                                            <TableRow key={attr._id}>
                                                <TableCell>
                                                    {(currentPage - 1) * rowsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell>{attr.name}</TableCell>
                                                <TableCell>
                                                    {attr.value && attr.value.map((value: string, idx: number) => (
                                                        <Chip key={`${attr._id}-${idx}`} label={value} size="small" sx={{ mr: 1, mb: 1 }} />
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex">
                                                        <IconButton size="small" color="default">
                                                            <Link to={`/dashboard/attribute-details/${attr._id}`}>
                                                                <Settings fontSize="small" />
                                                            </Link>
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
                                sx={{ mb: 2 }}
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
