import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CountryPricing {
    country_id: string;
    country: string;
    currency: string;
    currency_code: string;
    unit_price: number;
    discount?: number;
}

interface ProductData {
    name: string;
    product_type: 'digital' | 'physical';
    parent_category: string;
    brand: string;
    unit?: string;
    weight?: string;
    tags?: string;
    attribute: string;
    sub_category: string;
    attribute_value: string[];
    cash_on_delivery: boolean;
    country_pricing: CountryPricing[];
    quantity?: string;
    shipping_time: string;
    tax: string;
    description: string;
    image?: string | File;
    gallery1?: string | File;
    gallery2?: string | File;
    gallery3?: string | File;
    gallery4?: string | File;
    gallery5?: string | File;
    meta_title?: string;
    meta_desc?: string;
    color: string[];
}

interface Country {
    _id: string;
    country: string;
    currency_code: string;
    currency: string;
}

interface EditProductProps {
    id: string;
    open: boolean;
    handleClose: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ id, open, handleClose }) => {
    if (!open) return null;

    return (
        <div>
            <Dialog open={open} maxWidth="md" fullWidth sx={{ borderRadius: '15px'}}>
                <DialogTitle className='text-[24px] font-medium  text-black dark:text-white bg-white dark:bg-black'>
                    Edit Product
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
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditProduct;
