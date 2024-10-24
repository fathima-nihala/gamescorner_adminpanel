import { Edit } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { AppDispatch, RootState } from "../../redux/store";
import { editColor, getColors } from "../../slices/colorSlice";

// Type definitions
interface Color {
    _id: string;
    name: string;
    color_code: string;
}

interface EditColorProps {
    id: string;
}

const EditColor: React.FC<EditColorProps> = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<{ name: string; color_code: string }>({
        name: "",
        color_code: "",
    });

    const { enqueueSnackbar } = useSnackbar();
    const dispatch: AppDispatch = useDispatch();

    const { colors } = useSelector((state: RootState) => state.color);

    useEffect(() => {
        const colorToEdit = colors?.find((c: Color) => c._id === id);
        if (colorToEdit) {
            setData({
                name: colorToEdit.name,
                color_code: colorToEdit.color_code,
            });
        }
    }, [id, colors]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("color_code", data.color_code);

        try {
            await dispatch(editColor({ id, colorData: formData }));
            await dispatch(getColors({}));
            enqueueSnackbar("Color edited successfully!", { variant: "success", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
            handleClose();
        } catch (error: any) {
            enqueueSnackbar(`Failed to edit color: ${error.message}`, { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        }
    };

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <Edit fontSize="small" className="text-black dark:text-white" />
            </IconButton>

            <Dialog open={open} maxWidth="sm" fullWidth sx={{ borderRadius: '15px' }}>
                <DialogTitle className="text-[24px] font-medium text-black dark:text-white bg-white dark:bg-black">
                    Edit Color
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent className="bg-white dark:bg-black text-black dark:text-white">
                    <Box component="form" autoComplete="off">
                        <h3 className='text-[15px]'>Name</h3>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value }))}
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />

                        <h3 className='text-[15px]'>Color Code</h3>
                        <TextField
                            margin="dense"
                            id="color_code"
                            type="text"
                            fullWidth
                            value={data.color_code}
                            onChange={(e) => setData((prevData) => ({ ...prevData, color_code: e.target.value }))}
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', paddingTop: "10px", paddingBottom: "20px" }}
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
                        sx={{ color: '#fa6800', borderColor: '#fa6800', borderRadius: '10px', '&:hover': { borderColor: '#fa6800' } }}
                        variant="outlined" onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

EditColor.propTypes = {
    id: PropTypes.string.isRequired,
};

export default EditColor;
