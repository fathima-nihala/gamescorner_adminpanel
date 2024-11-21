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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { AppDispatch, RootState } from "../../redux/store";
import { addCoupon, getAllCoupons } from "../../slices/couponSlice";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Coupon: React.FC = () => {
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountValue: 0,
        expiry: "",
        discountType: "",
    });
    const [error, setError] = useState<{ code?: string; discountValue?: string; expiry?: string }>({});
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

    const handleFormSubmit = () => {
        const validationErrors: { code?: string; discountValue?: string; expiry?: string } = {};

        if (!newCoupon.code) validationErrors.code = "Code is required";
        if (!newCoupon.discountValue) validationErrors.discountValue = "Discount value is required";
        if (!newCoupon.expiry) validationErrors.expiry = "Expiration date is required";

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        const couponData = {
            code: newCoupon.code,
            discountValue: newCoupon.discountValue,
            expiry: newCoupon.expiry,
            discountType: newCoupon.discountType,
        };

        dispatch(addCoupon(couponData))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Coupon added successfully!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                setNewCoupon({ code: "", discountValue: 0, expiry: "", discountType: "" });
                setError({});
                dispatch(getAllCoupons());
            })
            .catch((error: any) => {
                enqueueSnackbar(`Failed to add coupon: ${error.message}`, {
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
                                        <TableCell>#</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Discount Type</TableCell>
                                        <TableCell>Discount Value</TableCell>
                                        <TableCell>Expiration Date</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : coupons && coupons.length > 0 ? (
                                        coupons.map((coupon, index) => {
                                            const couponData = [
                                                index + 1,
                                                coupon.code,
                                                coupon.discountType,
                                                coupon.discountValue,
                                                coupon.expiry ? new Date(coupon.expiry).toLocaleDateString() : "No Expiry",
                                            ];

                                            return (
                                                <TableRow key={coupon._id || index}>
                                                    {couponData.map((data, idx) => (
                                                        <TableCell key={idx}>{data}</TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No coupons found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ width: "35%", "@media (max-width: 834px)": { width: "100%", marginTop: "8px" } }}>
                            <Typography variant="h6" gutterBottom>Add New Coupon</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Coupon Code"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                    error={!!error.code}
                                    helperText={error.code}
                                />
                                 <FormControl fullWidth>
                                    <InputLabel>Discount Type</InputLabel>
                                    <Select
                                        label="Discount Type"
                                        value={newCoupon.discountType}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                    >
                                        <MenuItem value="percentage">Percentage</MenuItem>
                                        <MenuItem value="fixed">Fixed</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Discount Value"
                                    value={newCoupon.discountValue}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                                    error={!!error.discountValue}
                                    helperText={error.discountValue}
                                />
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={newCoupon.expiry}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                                    error={!!error.expiry}
                                    helperText={error.expiry}
                                />
                               
                                <Button variant="contained" color="primary" onClick={handleFormSubmit}>
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

