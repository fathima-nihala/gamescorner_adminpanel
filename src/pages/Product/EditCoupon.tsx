import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import { AppDispatch, RootState } from "../../redux/store";
import { getAllCoupons, updateCoupon } from "../../slices/couponSlice";

interface Coupon {
    _id?: string;
    code: string;
    discountValue: string;
    expiry: string;
    discountType: string;
}

interface EditCouponProps {
    id: string;
}

const EditCoupon: React.FC<EditCouponProps> = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<Coupon>({
        code: "",
        discountValue: "",
        expiry: "",
        discountType: "",
    });

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch<AppDispatch>();

    const { coupons } = useSelector((state: RootState) => state.coupon);

    useEffect(() => {
        const couponToEdit = coupons?.find((c: Coupon) => c._id === id);
        if (couponToEdit) {
            setData({
                code: couponToEdit.code,
                expiry: couponToEdit.expiry
                ? new Date(couponToEdit.expiry).toISOString().split("T")[0] // Convert to YYYY-MM-DD
                : "", 
                discountType: couponToEdit.discountType,
                discountValue: couponToEdit.discountValue,
            });
        }
    }, [id, coupons]);

   

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        const couponToEdit = coupons?.find((c: Coupon) => c._id === id);
        if (couponToEdit) {
            setData({
                code: couponToEdit.code,
                expiry: couponToEdit.expiry,
                discountType: couponToEdit.discountType,
                discountValue: couponToEdit.discountValue,
            });
        }
    };

    const handleSubmit = async () => {
        try {
            await dispatch(updateCoupon({ id, couponData: data })).unwrap();
            enqueueSnackbar("Coupon updated successfully!", { 
                variant: "success", 
                anchorOrigin: { vertical: 'top', horizontal: 'right' } 
            });
            dispatch(getAllCoupons());
            handleClose();
        } catch (error: any) {
            console.error("Error updating coupon:", error);
            enqueueSnackbar(`Failed to update coupon: ${error.message}`, { 
                variant: "error", 
                anchorOrigin: { vertical: 'top', horizontal: 'right' } 
            });
        }
    };

    return (
        <div>
            <IconButton onClick={handleOpen} color="primary" aria-label="edit">
                <EditIcon fontSize="small"/>
            </IconButton>

            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
                sx={{ '& .MuiDialog-paper': { borderRadius: '0px' } }}
            >
                <DialogTitle className="text-[24px] font-medium text-black dark:text-white bg-white dark:bg-black">
                Edit Coupon
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
                    <Box component="form" autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Coupon Code"
                            value={data.code}
                            onChange={(e) => setData({ ...data, code: e.target.value })}
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Discount Type</InputLabel>
                            <Select
                                label="Discount Type"
                                value={data.discountType}
                                onChange={(e) => setData({ ...data, discountType: e.target.value })}
                                slotProps={{
                                    input: {
                                        className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                    },
                                }}
                            >
                                <MenuItem value="percentage">Percentage</MenuItem>
                                <MenuItem value="flat">Fixed</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Discount Value"
                            value={data.discountValue}
                            onChange={(e) => setData({ ...data, discountValue: e.target.value })}
                            type="number"
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Expiry Date"
                            type="date"
                            value={data.expiry}
                            onChange={(e) => setData({ ...data, expiry: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            slotProps={{
                                input: {
                                    className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input",
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: "10px",
                    paddingBottom: "20px"
                }} className="bg-white dark:bg-black text-black dark:text-white">
                   
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
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

export default EditCoupon;