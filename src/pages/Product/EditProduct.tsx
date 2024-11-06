import { Dialog, DialogTitle, IconButton, Divider, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { fetchBrands } from '../../slices/brandSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { fetchAttributes } from '../../slices/attributeSlice';
import { fetchCategories } from '../../slices/categorySlice';
import { getAllColors } from '../../slices/colorSlice';
import DropzoneImage from '../../shared/DropzoneImage';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import MultipleColorSelect from '../../components/Forms/MultipleColorSelect';
import MultiSelect from '../../components/Forms/MultiSelect';
import QuillEditor from '../QuillEditor';



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
    parent_category: string;
    brand: string;
    unit?: string;
    weight?: string;
    tags?: string;
    attribute: string;
    sub_category: string;
    attribute_value: string[];

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

    color: string[];
}

interface EditProductProps {
    id: string;
    open: boolean;
    handleClose: () => void;
}

interface Country {
    _id: string;
    country: string;
    currency_code: string;
    currency: string;
}

const EditProduct: React.FC<EditProductProps> = ({ id, open, handleClose }) => {

    console.log(id,'iiiiidddd');
    
    if (!open) return null;
    const dispatch = useDispatch<AppDispatch>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewGallery, setPreviewGallery] = useState<(string | null)[]>([null, null, null, null, null]);
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
    const [priceDiscounts, setPriceDiscounts] = useState<Record<string, { price: string; discount: string }>>({});

    const [productData, setProductData] = useState<ProductData>({
        name: '',
        parent_category: '',
        unit: '',
        weight: '',
        tags: '',
        brand: '',
        attribute: '',
        sub_category: '',
        attribute_value: [],
        country_pricing: [],
        shipping_time: '',
        tax: '',
        description: '',
        color: [],
    });


    useEffect(() => {
        dispatch(fetchBrands());
        dispatch(fetchAttributes());
        dispatch(fetchCategories(''));
        dispatch(getAllColors());
    }, [dispatch])

    const handleDescriptionChange = (value: string) => {
        setProductData((prevState) => ({
            ...prevState,
            description: value, // Update the description value
        }));
    };
    const [attributes, setAttributes] = useState([{ _id: '1', name: 'Ram' }, { _id: '2', name: 'Testing' }]);

    const handleColorChange = (newColors: string[]) => {
        setProductData(prevData => ({ ...prevData, color: newColors }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProductData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAttributeValuesChange = (selectedValues: string[]) => {
        setProductData(prevData => ({ ...prevData, attribute_value: selectedValues }));
    };

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (fieldName === 'image') {
                setPreviewImage(result);
                setProductData((prevData) => ({
                    ...prevData,
                    image: file,
                }));
            } else if (fieldName.startsWith('gallery')) {
                const index = parseInt(fieldName.slice(-1)) - 1;
                const newPreviewGallery = [...previewGallery];
                newPreviewGallery[index] = result;
                setPreviewGallery(newPreviewGallery);
                setProductData((prevData) => ({
                    ...prevData,
                    [fieldName]: file,
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCountrySelectionChange = (countries: Country[]) => {
        setSelectedCountries(countries);

        const updatedPriceDiscounts = countries.reduce((acc, country) => {
            acc[country._id] = priceDiscounts[country._id] || { price: '', discount: '' };
            return acc;
        }, {} as Record<string, { price: string; discount: string }>);

        setPriceDiscounts(updatedPriceDiscounts);
    };

    const handleCountryChange = (countryId: string, field: 'price' | 'discount', value: string) => {
        setPriceDiscounts(prev => ({
            ...prev,
            [countryId]: {
                ...prev[countryId],
                [field]: value
            }
        }));
    };


    return (
        <div>
            <Dialog
                open={open}
                fullWidth
                maxWidth="md"
                className="relative w-full lg:w-[90vw] lg:h-[90vh] lg:ml-auto "
                sx={{ borderRadius: '15px', padding: '1rem', }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    className="absolute top-2 right-2 z-50"
                    sx={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        color: 'gray',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogTitle className="text-[24px] font-medium text-black dark:text-white bg-white dark:bg-black">
                    Edit Product
                </DialogTitle>
                <Divider />
                <DialogContent className="bg-white dark:bg-black text-black dark:text-white space-y-6 p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">Product Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.name}
                                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Categories</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.parent_category}
                                onChange={(e) => setProductData({ ...productData, parent_category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Subcategories</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.sub_category}
                                onChange={(e) => setProductData({ ...productData, sub_category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Brand</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.brand}
                                onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Unit</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.unit || ''}
                                onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Weight</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.weight || ''}
                                onChange={(e) => setProductData({ ...productData, weight: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Tax</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tax: e.target.value })}
                            />
                        </div>


                        <div >
                            <label className="block text-sm font-medium">Estimated Shipping Price</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tax: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Estimated Shipping Time</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tax: e.target.value })}
                            />
                        </div>


                        <div className="col-span-2">
                            <label className="block text-sm font-medium">Tags</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tags: e.target.value })}
                            />
                        </div>

                    </div>



                    <div className="bg-white mt-4  w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                        <div className='block w-full lg:mt-8'>
                            <p>Thumbnail</p>
                            <DropzoneImage
                                onChange={(event) => onFileUpload(event, 'image')}
                                image={previewImage}
                                id="thumbnail-upload"
                            />
                        </div>

                        <div className="mt-10">
                            <p>Gallery Images</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <DropzoneImage
                                        key={index}
                                        onChange={(event) => onFileUpload(event, `gallery${index + 1}`)}
                                        image={previewGallery[index]}
                                        id={`gallery-upload-${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="bg-white shadow-lg rounded-md dark:bg-black mt-5 w-full">
                        <div className="p-3">
                            <div className="p-6 bg-white dark:bg-black">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-xl font-semibold">Price and Stock Information</h5>
                                </div>

                                <div>
                                    <SelectGroupTwo
                                        selectedCountries={selectedCountries}
                                        onChange={handleCountrySelectionChange}
                                    />
                                </div>

                                {selectedCountries.map((country) => (
                                    <div key={country._id} className="mt-5">
                                        <div className="grid grid-cols-12 gap-4 mb-4">
                                            <label className="col-span-3 text-gray-700 text-sm font-medium">
                                                Unit Price for {country.currency_code}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="col-span-9">
                                                <input
                                                    type="number"
                                                    className="dark:bg-form-input form-control w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                    placeholder="Unit price"
                                                    min="0"
                                                    step="0.01"
                                                    value={priceDiscounts[country._id]?.price || ''}
                                                    onChange={(e) => handleCountryChange(country._id, 'price', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 gap-4 mb-4">
                                            <label className="col-span-3 text-gray-700 text-sm font-medium">
                                                Discount for {country.currency_code}{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="col-span-9">
                                                <input
                                                    type="number"
                                                    className="dark:bg-form-input form-control w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                    placeholder="Discount"
                                                    min="0"
                                                    step="0.01"
                                                    value={priceDiscounts[country._id]?.discount || ''}
                                                    onChange={(e) => handleCountryChange(country._id, 'discount', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Quantity */}
                                <div className="mt-2">
                                    <div className="grid grid-cols-12 gap-4 mb-4">
                                        <label className="col-span-3 text-gray-700 text-sm font-medium">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="col-span-9">
                                            <input
                                                name="quantity"
                                                type="number"
                                                className="dark:bg-form-input bg-white form-control w-full px-4 py-2 border border-gray-300 rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                placeholder="Quantity"
                                                min="0"
                                                step="1"
                                                value={productData.quantity}
                                            // onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Product Variation */}

                    <div className="bg-white mt-4 w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                        <div className=" rounded-md">
                            <h5 className="text-xl font-semibold mb-4">Product Variation</h5>

                            <div className='w-full'>
                                <MultipleColorSelect
                                    selectedColors={productData.color}
                                    onChange={handleColorChange}
                                    className="mb-4"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Attribute Dropdown */}
                                <div className="w-full">
                                    <label className="block text-gray-700 dark:text-white mb-2">Attribute</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                        name="attribute"
                                        value={productData.attribute}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" className="text-body dark:text-bodydark">Select attribute</option>
                                        {attributes.map((attribute) => (
                                            <option key={attribute._id} value={attribute._id} className="text-body dark:text-bodydark">
                                                {attribute.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {productData.attribute && (
                                <div className='mt-2'>
                                    <MultiSelect
                                        attributeId={productData.attribute}
                                        selectedValues={productData.attribute_value}
                                        onChange={handleAttributeValuesChange}
                                    />
                                </div>
                            )}

                        </div>
                    </div>


                    {/* Product Description */}

                    <div className="bg-white shadow-lg rounded-md p-6 dark:bg-black mt-5 w-full">
                        <h2 className="text-lg font-semibold mb-5">Product Description</h2>
                        <div className="">
                            <QuillEditor
                                value={productData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter your description here"
                            />

                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button className="bg-red-500 text-white p-2 rounded">
                            Cancel
                        </button>
                        <button className="bg-blue-500 text-white p-2 rounded">
                            Save
                        </button>
                    </div>


                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditProduct;
