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
import PropTypes from "prop-types";
import { AppDispatch, RootState } from '../../redux/store';


// Define the props for the component
interface EditAttributeNameProps {
    id: string;
}

const EditAttributeName: React.FC<EditAttributeNameProps> = ({ id }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [data, setData] = useState<{ name: string }>({ name: "" });
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch<AppDispatch>();
    const { attributes } = useSelector((state: RootState) => state.attribute);

    useEffect(() => {
        const attributeToEdit = attributes.find((at: any) => at._id === id);
        if (attributeToEdit) {
            setData({
                name: attributeToEdit.name,
            });
        }
    }, [id, attributes]);

    const handleSubmit = async () => {
        if (!data.name.trim()) {
            enqueueSnackbar("Name is required", { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' }, });
            return;
        }

        try {
            await dispatch(updateAttribute({ id, updatedAttribute: { name: data.name, value: [] } }));
            enqueueSnackbar("Attribute edited successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' }, });
            handleClose();
        } catch (error: any) {
            enqueueSnackbar(`Failed to edit attribute: ${error.message}`, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' }, });
        }
    };

    return (
        <div>
            <IconButton size="small" onClick={handleOpen}>
                <Edit fontSize="small" className="text-black dark:text-white"/>
            </IconButton>

            <Dialog open={open} maxWidth="sm" fullWidth sx={{ borderRadius: "15px" }}>
                <DialogTitle className="text-[24px] font-medium text-black dark:text-white bg-white dark:bg-black">
                    Edit Attribute Name
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
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
                            value={data.name}
                            onChange={(e) => setData({ name: e.target.value })}
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
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "20px" }}
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
                        sx={{
                            color: "#fa6800",
                            borderColor: "#fa6800",
                            borderRadius: "10px",
                            "&:hover": { borderColor: "#fa6800" },
                        }}
                        variant="outlined"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


EditAttributeName.propTypes = {
    id: PropTypes.string.isRequired,
};

export default EditAttributeName;
