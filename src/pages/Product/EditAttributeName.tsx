import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    TextField,
} from "@mui/material";
import { Edit, Close as CloseIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { updateAttribute } from "../../slices/attributeSlice";
import { AppDispatch, RootState } from '../../redux/store';

interface EditAttributeNameProps {
    id: string;
}

const EditAttributeName: React.FC<EditAttributeNameProps> = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch<AppDispatch>();
    const { attributes } = useSelector((state: RootState) => state.attribute);

    useEffect(() => {
        const attributeToEdit = attributes.find(attr => attr._id === id);
        if (attributeToEdit) {
            setName(attributeToEdit.name);
        }
    }, [id, attributes]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            enqueueSnackbar("Name is required", {
                variant: "error",
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            return;
        }

        try {
            await dispatch(updateAttribute({ id, updatedAttribute: { name, value: [] } })).unwrap();
            enqueueSnackbar("Attribute name updated successfully!", {
                variant: "success",
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            handleClose();
        } catch (error: any) {
            enqueueSnackbar(`Failed to update attribute name: ${error.message}`, {
                variant: "error",
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
        }
    };

    return (
        <div>
            <IconButton size="small" onClick={handleOpen}>
                <Edit fontSize="small" className="text-black dark:text-white" />
            </IconButton>

            <Dialog open={open} maxWidth="sm" fullWidth>
                <DialogTitle className="text-[24px] font-medium text-black dark:text-white bg-white dark:bg-black">
                    Edit Attribute Name
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent className="bg-white dark:bg-black text-black dark:text-white">
                    <Box component="form" autoComplete="off">
                        <h3 className="text-[15px]">Name</h3>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        paddingBottom: "20px"
                    }}
                    className="bg-white dark:bg-black text-black dark:text-white"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        className='px-4'
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditAttributeName;