import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, IconButton, Divider, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchBrands } from '../../slices/brandSlice';
import { fetchAttributes, fetchAttributeValues } from '../../slices/attributeSlice';
import { fetchCategories, fetchCategoryNames, selectCategoryNames } from '../../slices/categorySlice';
import { getAllColors } from '../../slices/colorSlice';
import DropzoneImage from '../../shared/DropzoneImage';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import MultiSelect from '../../components/Forms/MultiSelect';
import QuillEditor from '../QuillEditor';
import MultipleColorSelect from '../../components/Forms/MultipleColorSelect';
import DropzoneGallery from '../../shared/DropzoneGallary';
import { editProduct } from '../../slices/productSlice';

interface CountryPricing {
    country_id: string;
    country: string;
    currency: string;
    currency_code: string;
    unit_price: number;
    discount?: number;
    quantity?: string;
}

interface ProductData {
    _id?: string;
    name: string;
    parent_category: string;
    brand: string;
    unit?: string;
    weight?: string;
    tags?: string;
    attribute: string;
    sub_category: string;
    attribute_value: string[];
    // country_pricing: CountryPricing[];
    country_pricing: Array<{
        country_id: string;
        country: string;
        currency: string;
        currency_code: string;
        unit_price: number;
        discount: number;
    }>;
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

interface PriceDiscount {
    price: string;
    discount: string;
}

const EditProduct: React.FC<EditProductProps> = ({ id, open, handleClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { products } = useSelector((state: RootState) => state.product);
    const { attributes } = useSelector((state: RootState) => state.attribute);
    const brands = useSelector((state: RootState) => state.brands.brands);
    const categoryNames = useSelector(selectCategoryNames);
    const { categories } = useSelector((state: RootState) => state.category);
    const [productData, setProductData] = useState<ProductData>({
        name: '',
        parent_category: '',
        brand: '',
        unit: '',
        weight: '',
        tags: '',
        attribute: '',
        sub_category: '',
        attribute_value: [],
        country_pricing: [],
        quantity: '',
        shipping_time: '',
        tax: '',
        description: '',
        image: '',
        gallery1: '',
        gallery2: '',
        gallery3: '',
        gallery4: '',
        gallery5: '',
        color: []
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewGallery, setPreviewGallery] = useState<(string | null)[]>(Array(5).fill(null));
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
    const [priceDiscounts, setPriceDiscounts] = useState<Record<string, { price: string; discount: string; }>>({});

    useEffect(() => {
        if (products && id) {
            const proToEdit = products.find((prod) => prod?._id === id);
            if (proToEdit) {
                console.log(proToEdit.color, 'huyuuu');
                const attributeIds = proToEdit.attribute.map((attr: any) => attr._id);

                setProductData({
                    ...proToEdit,
                    parent_category: Array.isArray(proToEdit.parent_category) && proToEdit.parent_category.length > 0
                        ? proToEdit.parent_category[0]._id
                        : '',
                    sub_category: Array.isArray(proToEdit.sub_category) && proToEdit.sub_category.length > 0 ? proToEdit.sub_category[0]._id : '',
                    brand: Array.isArray(proToEdit.brand) && proToEdit.brand.length > 0 ? proToEdit.brand[0]._id : '',
                    image: proToEdit.image || '',
                    gallery1: proToEdit.gallery1 || '',
                    gallery2: proToEdit.gallery2 || '',
                    gallery3: proToEdit.gallery3 || '',
                    gallery4: proToEdit.gallery4 || '',
                    gallery5: proToEdit.gallery5 || '',
                    color: proToEdit.color.map((c: any) => c._id) || [],
                    attribute: proToEdit.attribute.map((c: any) => c._id) || [],
                    attribute_value: proToEdit.attribute_value.map((c: any) => c._id) || []
                });
                setPreviewImage(proToEdit.image as string);
                setPreviewGallery([
                    proToEdit.gallery1 || null,
                    proToEdit.gallery2 || null,
                    proToEdit.gallery3 || null,
                    proToEdit.gallery4 || null,
                    proToEdit.gallery5 || null,
                ]);

                if (Array.isArray(proToEdit.country_pricing)) {
                    setSelectedCountries(
                        proToEdit.country_pricing.map((c: CountryPricing) => ({
                            _id: c.country_id,
                            country: c.country,

                            currency: c.currency,
                            currency_code: c.currency_code
                        }))
                    );

                    const initialPriceDiscounts = proToEdit.country_pricing.reduce(
                        (acc: Record<string, { price: string; discount: string; }>, curr: CountryPricing) => {
                            acc[curr.country_id] = {
                                price: String(curr.unit_price),
                                discount: String(curr.discount || ''),
                            };
                            return acc;
                        },
                        {} as Record<string, { price: string; discount: string; }>
                    );

                    setPriceDiscounts(initialPriceDiscounts);
                }
                if (proToEdit?.attribute) {
                    dispatch(fetchAttributeValues(attributeIds));
                }
            }
        }


    }, [products, id]);

    useEffect(() => {
        dispatch(fetchCategories(''));
        dispatch(fetchBrands());
        dispatch(fetchAttributes());
        dispatch(fetchCategories(''));
        dispatch(getAllColors());
    }, [dispatch]);

    useEffect(() => {
        if (productData?.parent_category) {
            dispatch(fetchCategoryNames(productData.parent_category));
        }
    }, [dispatch, productData.parent_category]);


    useEffect(() => {
        if (productData.attribute) {
            dispatch(fetchAttributeValues(productData.attribute))
        }
    }, [dispatch, productData])


    const handleDescriptionChange = (value: string) => {
        setProductData((prevState) => ({ ...prevState, description: value }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAttributeValuesChange = (selectedValues: string[]) => {
        setProductData((prevData) => ({ ...prevData, attribute_value: selectedValues }));
    };

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (fieldName === 'image') {
                setPreviewImage(result);
                setProductData((prevData) => ({ ...prevData, image: file }));
            } else if (fieldName.startsWith('gallery')) {
                const index = parseInt(fieldName.slice(-1)) - 1;
                const newPreviewGallery = [...previewGallery];
                newPreviewGallery[index] = result;
                setPreviewGallery(newPreviewGallery);
                setProductData((prevData) => ({ ...prevData, [fieldName]: file }));
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (productData?.country_pricing?.length) {
            const existingCountries = productData.country_pricing.map(pricing => ({
                _id: pricing.country_id,
                country: pricing.country,
                currency: pricing.currency,
                currency_code: pricing.currency_code
            }));
            setSelectedCountries(existingCountries);

            const existingPriceDiscounts = productData.country_pricing.reduce((acc, pricing) => {
                acc[pricing.country_id] = {
                    price: pricing.unit_price.toString(),
                    discount: pricing.discount.toString()
                };
                return acc;
            }, {} as Record<string, PriceDiscount>);
            setPriceDiscounts(existingPriceDiscounts);
        }
    }, [productData]);

    const handleCountrySelectionChange = (countries: Country[]) => {
        setSelectedCountries(countries);
        const updatedPriceDiscounts = countries.reduce((acc, country) => {
            acc[country._id] = priceDiscounts[country._id] || { price: '', discount: '' };
            return acc;
        }, {} as Record<string, PriceDiscount>);
        setPriceDiscounts(updatedPriceDiscounts);
    };

    const handleCountryChange = (countryId: string, field: 'price' | 'discount', value: string) => {
        if (value && !/^\d*\.?\d*$/.test(value)) return;
        
        setPriceDiscounts(prev => ({
            ...prev,
            [countryId]: {
                ...prev[countryId],
                [field]: value
            }
        }));
    };

    const handleColorChange = (selectedColors: string[]) => {
        setProductData(prev => ({
            ...prev,
            color: selectedColors
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();

            // Add basic fields
            formData.append('name', productData.name);
            formData.append('description', productData.description);
            formData.append('parent_category', productData.parent_category);
            formData.append('brand', productData.brand);
            formData.append('sub_category', productData.sub_category);

            // Add optional fields if they exist
            if (productData.unit) formData.append('unit', productData.unit);
            if (productData.weight) formData.append('weight', productData.weight);
            if (productData.tags) formData.append('tags', productData.tags);
            if (productData.shipping_time) formData.append('shipping_time', productData.shipping_time);
            if (productData.tax) formData.append('tax', productData.tax);
            if (productData.quantity) formData.append('quantity', productData.quantity);

            productData.color.forEach((color) => {
                formData.append('color', color);
            });

            formData.append('attribute', productData.attribute);

            if (Array.isArray(productData.attribute_value)) {
                productData.attribute_value.forEach(attrVal => {
                    formData.append('attribute_value[]', attrVal);
                });
            }


            const countryPricingData = selectedCountries.map(country => {
                const priceData = priceDiscounts[country._id];
                if (!priceData?.price) {
                    throw new Error(`Please enter price for ${country.country}`);
                }
                
                return {
                    country_id: country._id,
                    country: country.country,
                    currency: country.currency,
                    currency_code: country.currency_code,
                    unit_price: parseFloat(priceData.price),
                    discount: priceData.discount ? parseFloat(priceData.discount) : 0
                };
            });

            formData.append('country_pricing', JSON.stringify(countryPricingData));

            // Handle image files
            if (productData.image instanceof File) {
                formData.append('image', productData.image);
            }

            // Handle gallery images
            ['gallery1', 'gallery2', 'gallery3', 'gallery4', 'gallery5'].forEach((gallery) => {
                const galleryFile = productData[gallery as keyof ProductData];
                if (galleryFile instanceof File) {
                    formData.append(gallery, galleryFile);
                }
            });
            const result = await dispatch(editProduct({ id, formData })).unwrap();

            if (result.success) {
                handleClose();
            } else {
                setError(result.message || 'Failed to update product');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while updating the product');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div>
            <Dialog
                open={open}
                fullWidth
                maxWidth="md"
                className="relative w-full lg:w-[90vw] lg:h-[90vh] lg:ml-60 "
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
                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Product Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-white dark:bg-form-input"
                            value={productData.name}
                            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                        />
                    </div>
                    <div className='flex md:flex-row flex-col gap-6'>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Categories</label>
                            <select
                                className="w-full border border-gray-300 rounded-md bg-transparent py-3 px-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                name="parent_category"
                                value={productData.parent_category || ''}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Category</option>
                                {categories?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.parent_category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='w-full'>
                            <label className="block text-sm font-medium">Subcategories</label>
                            <select
                                className="w-full border border-gray-300 rounded-md bg-transparent py-3 px-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                name="sub_category"
                                value={productData.sub_category || ''}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Subcategory</option>
                                {Array.isArray(categoryNames?.name) && categoryNames?.name?.map((subcategory) => (
                                    <option key={subcategory._id} value={subcategory._id}>
                                        {subcategory.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='flex md:flex-row flex-col gap-4'>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Brand</label>
                            <select
                                className="w-full  border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                name="brand"
                                value={productData.brand}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Brand</option>
                                {brands && brands.map((brand) => (
                                    <option key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Unit</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded bg-white dark:bg-form-input"
                                value={productData.unit || ''}
                                onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                            />
                        </div>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Weight</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded bg-white dark:bg-form-input"
                                value={productData.weight || ''}
                                onChange={(e) => setProductData({ ...productData, weight: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='flex md:flex-row flex-col gap-4'>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Tax</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded bg-white dark:bg-form-input"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tax: e.target.value })}
                            />
                        </div>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Estimated Shipping Price</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded bg-white dark:bg-form-input"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tax: e.target.value })}
                            />
                        </div>
                        <div className='w-full'>
                            <label className="block text-sm font-medium">Estimated Shipping Time</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded bg-white dark:bg-form-input"
                                value={productData.tax}
                                onChange={(e) => setProductData({ ...productData, tax: e.target.value })}
                            />
                        </div>
                    </div>


                    <div className="col-span-2">
                        <label className="block text-sm font-medium ">Tags</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-white dark:bg-form-input"
                            value={productData.tax}
                            onChange={(e) => setProductData({ ...productData, tags: e.target.value })}
                        />
                    </div>



                    {/* Image section */}
                    <div className="bg-white mt-4 w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black">
                        <div className='block w-full lg:mt-8'>
                            <p>Thumbnail</p>
                            <DropzoneGallery
                                onChange={(event) => {
                                    onFileUpload(event, 'image');

                                    const files = event.target.files;
                                    if (files && files[0]) {
                                        const url = URL.createObjectURL(files[0]);
                                        setPreviewImage(url);
                                    }
                                }}
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
                                        onChange={(event) => {
                                            onFileUpload(event, `gallery${index + 1}`);

                                            const files = event.target.files;
                                            if (files && files[0]) {
                                                const url = URL.createObjectURL(files[0]);
                                                setPreviewGallery((prevGallery) => {
                                                    const updatedGallery = [...prevGallery];
                                                    updatedGallery[index] = url;
                                                    return updatedGallery;
                                                });
                                            }
                                        }}

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

                                {/* Display selected countries and their pricing/quantity information */}
                                {selectedCountries.map((country) => (
                                    <div key={country._id} className="mt-5">
                                        <div className="grid grid-cols-12 gap-4 mb-4">
                                            <label className="col-span-3 text-gray-700 text-sm font-medium">
                                                Unit Price for {country.currency_code} <span className="text-red-500">*</span>
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
                                                Discount for {country.currency_code}
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
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Product Variation */}

                    <div className="bg-white mt-4 w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black">
                        <div className="rounded-md">
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
                                        {attributes?.map((attribute) => (
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
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="error-message mb-4 text-red-500">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </form>
                        <button className="bg-red-500 text-white p-2 rounded" onClick={handleClose}>
                            Cancel
                        </button>
                    </div>


                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditProduct;
