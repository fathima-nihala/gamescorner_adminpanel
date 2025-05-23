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
import { Settings, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addAttribute, deleteAttribute, fetchAttributes } from "../../slices/attributeSlice";
import { useSnackbar } from "notistack";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import EditAttributeName from "./EditAttributeName";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Attributes: React.FC = () => {
    const [newAttributeName, setNewAttributeName] = useState("");
    const [error, setError] = useState<{ name?: string }>({});
    const { enqueueSnackbar } = useSnackbar();
    const [delOpen, setDelOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const { attributes, loading, error: stateError } = useSelector((state: RootState) => state.attribute);

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    useEffect(() => {
        if (stateError) {
            enqueueSnackbar(stateError, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        }
    }, [stateError, enqueueSnackbar]);

    const validateInput = () => {
        if (!newAttributeName.trim()) {
            setError({ name: "Name is required" });
            return false;
        }
        setError({});
        return true;
    };

    const handleFormSubmit = async () => {
        if (validateInput()) {
            try {
                await dispatch(addAttribute({ name: newAttributeName, value: [] })).unwrap();
                enqueueSnackbar("Attribute added successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
                setNewAttributeName("");
            } catch (error: any) {
                enqueueSnackbar(error.message || "Failed to add attribute.", { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            }
        }
    };

    const handleDeleteClick = (itemId: string) => {
        setSelectedItem(itemId);
        setDelOpen(true);
    };

    const handleEdit = (itemId: string) => {
        setSelectedItem(itemId);
    };

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Breadcrumb pageName="Attribute" />

            <div className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
                <Box sx={{ p: 3 }}>
                    {/* <Typography variant="h5" gutterBottom>Attributes</Typography> */}
                    <Box
                        sx={{
                            display: {
                                xs: 'block',
                                md: 'flex',
                            },
                        }}
                    >
                        <TableContainer component={Paper} className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark "
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
                                                    {attr.value && attr.value.map((valueObj, idx) => (
                                                        <Chip key={`${attr._id}-${idx}`} label={valueObj.value} size="small" sx={{ mr: 1, mb: 1 }} className="text-black dark:text-white" />
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
                                                            <EditAttributeName id={attr._id} />
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

                        <Box sx={{
                            width: '35%',
                            '@media (max-width: 834px)': {
                                width: '100%',
                                marginTop: '8px'
                            },
                        }}>
                            <Typography variant="h6" gutterBottom>Add New Attribute</Typography>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                id="name"
                                type="text"
                                value={newAttributeName}
                                onChange={(e) => setNewAttributeName(e.target.value)}
                                error={!!error.name}
                                helperText={error.name}
                                slotProps={{
                                    input: {
                                        className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
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
                {/* </Card> */}
            </div>
            <ConfirmationModal
                delOpen={delOpen}
                delHandleClose={() => setDelOpen(false)}
                onDelete={onDelete}
            />
        </div>
    );
};

export default Attributes;