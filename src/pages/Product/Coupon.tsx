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
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { AppDispatch, RootState } from "../../redux/store";
import { addCoupon, getAllCoupons, deleteCoupon } from "../../slices/couponSlice";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCoupon from "./EditCoupon";

interface Coupon {
    _id: string; 
    code: string;
    discountValue: string;
    expiry: string;
    discountType: string;
}

interface ValidationErrors {
    code?: string;
    discountValue?: string;
    expiry?: string;
}

const Coupon: React.FC = () => {
    const [newCoupon, setNewCoupon] = useState<Omit<Coupon, '_id'>>({
        code: "",
        discountValue: "",
        expiry: "",
        discountType: "",
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch<AppDispatch>();

    const { coupons, loading, error: stateError } = useSelector(
        (state: RootState) => state.coupon
    );

    useEffect(() => {
        dispatch(getAllCoupons());
    }, [dispatch]);

    useEffect(() => {
        if (stateError) {
            enqueueSnackbar(stateError, { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
        }
    }, [stateError, enqueueSnackbar]);

    const validateCoupon = (coupon: Omit<Coupon, '_id'>): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!coupon.code) errors.code = "Code is required";
        if (!coupon.discountValue) errors.discountValue = "Discount value is required";
        if (!coupon.expiry) errors.expiry = "Expiration date is required";

        return errors;
    };

    const handleFormSubmit = () => {
        const errors = validateCoupon(newCoupon);
        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            dispatch(addCoupon(newCoupon))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("Coupon added successfully!", {
                        variant: "success",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                    });
                    setNewCoupon({ code: "", discountValue: "", expiry: "", discountType: "" });
                    setValidationErrors({});
                })
                .catch((error: Error) => {
                    enqueueSnackbar(`Failed to add coupon: ${error.message}`, {
                        variant: "error",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                    });
                });
        }
    };

    const handleDelete = (couponId: string) => {
        dispatch(deleteCoupon(couponId))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Coupon deleted successfully!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            })
            .catch((error: Error) => {
                enqueueSnackbar(`Failed to delete coupon: ${error.message}`, {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            });
    };

    return (
        <div>
            <Breadcrumb pageName="Coupons" />

            <div className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: { xs: "block", md: "flex" } }}>
                        <TableContainer
                            component={Paper}
                            className="bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                            sx={{ mr: 2, width: "65%", "@media (max-width: 834px)": { width: "100%" } }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-black dark:text-white">#</TableCell>
                                        <TableCell className="text-black dark:text-white">Code</TableCell>
                                        <TableCell className="text-black dark:text-white">Discount Type</TableCell>
                                        <TableCell className="text-black dark:text-white">Discount Value</TableCell>
                                        <TableCell className="text-black dark:text-white">Expiration Date</TableCell>
                                        <TableCell className="text-black dark:text-white">Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : coupons && coupons.length > 0 ? (
                                        coupons.map((coupon, index) => (
                                            <TableRow key={coupon._id}>
                                                <TableCell className="text-black dark:text-white">{index + 1}</TableCell>
                                                <TableCell className="text-black dark:text-white">{coupon.code}</TableCell>
                                                <TableCell className="text-black dark:text-white">{coupon.discountType}</TableCell>
                                                <TableCell className="text-black dark:text-white">{coupon.discountValue}</TableCell>
                                                <TableCell className="text-black dark:text-white">
                                                    {coupon.expiry
                                                        ? new Date(coupon.expiry).toLocaleDateString()
                                                        : "No Expiry"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <EditCoupon id={coupon._id}  />
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => handleDelete(coupon._id)}
                                                            aria-label="delete"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No coupons found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ width: "35%", "@media (max-width: 834px)": { width: "100%", marginTop: "8px" } }}>
                            <Typography variant="h6" gutterBottom>
                                Add New Coupon
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Coupon Code"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                    error={!!validationErrors.code}
                                    helperText={validationErrors.code}
                                    slotProps={{
                                        input: {
                                            className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
                                        },
                                    }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Discount Type</InputLabel>
                                    <Select
                                        label="Discount Type"
                                        value={newCoupon.discountType}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                        slotProps={{
                                            input: {
                                                className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
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
                                    type="number"
                                    value={newCoupon.discountValue}
                                    onChange={(e) => setNewCoupon({
                                        ...newCoupon,
                                        discountValue: e.target.value
                                    })}
                                    error={!!validationErrors.discountValue}
                                    helperText={validationErrors.discountValue}
                                    slotProps={{
                                        input: {
                                            className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Expiry Date"
                                    type="date"
                                    value={newCoupon.expiry}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!validationErrors.expiry}
                                    helperText={validationErrors.expiry}
                                    slotProps={{
                                        input: {
                                            className: "text-black dark:text-white border border-stroke dark:border-strokedark bg-white dark:bg-form-input mb-2",
                                        },
                                    }}
                                   
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleFormSubmit}
                                    fullWidth
                                >
                                    Add Coupon
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default Coupon;