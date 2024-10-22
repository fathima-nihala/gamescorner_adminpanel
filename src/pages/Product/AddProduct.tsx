import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import React, { useEffect, useState } from 'react';
import SwitcherThree from '../../components/Switchers/SwitcherThree';
import DropzoneImage from '../../shared/DropzoneImage';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import 'react-quill/dist/quill.snow.css';
import QuillEditor from '../QuillEditor';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { resetSuccess } from '../../slices/productSlice';
import { useSnackbar } from 'notistack';
import { fetchBrands } from '../../slices/brandSlice';
import { fetchAttributes } from '../../slices/attributeSlice';
import { fetchCategories, fetchCategoryNames, selectCategoryNames } from '../../slices/categorySlice';


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
    product_type: string;
    parent_category: string;
    brand: string;
    unit?: string;
    weight?: string;
    tags?: string;
    attribute: string;
    sub_category: string[];
    attribute_value: string[];
    cash_on_delivery: boolean;
    country_pricing: CountryPricing[];
    quantity?: string;
    shipping_time?: string;
    tax?: string;
    description: string;
    image?: string | File;
    gallery1?: string | File;
    gallery2?: string | File;
    gallery3?: string | File;
    gallery4?: string | File;
    gallery5?: string | File;
    meta_title?: string;
    meta_desc?: string;
}

const AddProduct: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { success, error } = useSelector((state: RootState) => state.product);
    const brands = useSelector((state: RootState) => state.brands.brands);
    const { categories } = useSelector((state: RootState) => state.category);
    const { enqueueSnackbar } = useSnackbar();
    const categoryNames = useSelector(selectCategoryNames);

    useEffect(() => {
        dispatch(fetchCategoryNames(productData.parent_category));
    }, [dispatch]);


    const [productData, setProductData] = useState<ProductData>({
        name: '',
        product_type: 'physical',
        parent_category: '',
        sub_category: [],
        brand: '',
        unit: '',
        weight: '',
        tags: '',
        attribute: '',
        attribute_value: [],
        cash_on_delivery: false,
        country_pricing: [
            { country_id: '', country: '', currency: '', currency_code: '', unit_price: 0, discount: 0 }
        ],
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
        meta_title: '',
        meta_desc: ''
    });

    useEffect(() => {
        dispatch(fetchBrands());
        dispatch(fetchAttributes());
        dispatch(fetchCategories(''));
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchCategoryNames(productData.parent_category));
    }, [dispatch, productData.parent_category]);



    const handleInputChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setProductData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        if (name === 'parent_category') {
            setProductData((prevData) => ({
                ...prevData,
                parent_category: value.trim(),
                sub_category: []
            }));
            dispatch(fetchCategoryNames(value.trim()));
        }

        if (name === 'attribute') {
            setProductData((prevData) => ({
                ...prevData,
                attribute: value,
                attribute_value: []
            }));
        }
    };

    const handleDescriptionChange = (value: string) => {
        setProductData(prev => ({
            ...prev,
            description: value
        }));
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewGallery, setPreviewGallery] = useState<(string | null)[]>([null, null, null, null, null]);

    const [cashOnDelivery, setCashOnDelivery] = useState(false);

    const handleToggleCashOnDelivery = (enabled: boolean) => {
        setCashOnDelivery(enabled);
    };

    useEffect(() => {
        if (success) {
            enqueueSnackbar('Product added successfully!', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            dispatch(resetSuccess());
        }
        if (error) {
            enqueueSnackbar(error, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
        }
    }, [success, error, dispatch, enqueueSnackbar]);



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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <>
            <Breadcrumb pageName="Product Information" />

            <div className="p-1 bg-gray-100 min-h-screen">
                <form onSubmit={handleSubmit}>

                    <div className='flex lg:flex-row flex-col gap-3'>

                        <div className="bg-white lg:w-[70%] w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            name="name"
                                            value={productData.name}
                                            onChange={handleInputChange}
                                            placeholder="Product Name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">
                                        Product Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="sm:col-span-2">
                                        <select
                                            className="w-full  border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                            name="product_type"
                                            value={productData.product_type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Physical" className="text-body dark:text-bodydark">Physical</option>
                                            <option value="Digital" className="text-body dark:text-bodydark"> Digital</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-black dark:text-white">
                                    <label className="text-gray-700 text-sm font-medium">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="sm:col-span-2">
                                        <select
                                            className="w-full border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                            name="parent_category"
                                            value={productData.parent_category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories?.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.parent_category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">Brand</label>
                                    <div className="sm:col-span-2">
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
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">Unit</label>
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            name="unit"
                                            value={productData.unit}
                                            onChange={handleInputChange}
                                            placeholder="e.g., pieces, kg, etc."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">Weight</label>
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            name="weight"
                                            value={productData.weight}
                                            onChange={handleInputChange}
                                            placeholder="Product weight"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">Tags</label>
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            name="tags"
                                            value={productData.tags}
                                            onChange={handleInputChange}
                                            placeholder="Comma-separated tags"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="lg:w-[30%] w-full flex flex-col gap-4">

                            {/* Cash on Delivery Box */}
                            <div className="bg-white rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                                <h5 className="text-xl font-semibold mb-4">Cash on Delivery</h5>
                                <SwitcherThree onToggle={handleToggleCashOnDelivery} />
                            </div>

                            {/* Estimated Shipping Time Box */}
                            <div className="bg-white rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black  ">
                                <h5 className="text-xl font-semibold mb-4">Estimated Shipping Time</h5>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    name="shipping_time"
                                    placeholder="Enter estimated shipping time"
                                />
                            </div>

                            {/* VAT & TAX */}
                            <div className="bg-white text-graydark dark:text-white dark:bg-black p-6 shadow-lg rounded-md ">
                                <h5 className="text-xl font-semibold mb-4">VAT & TAX</h5>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="0"
                                    name='tax'
                                />
                            </div>

                        </div>

                    </div>


                    {/* images  */}
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


                    {/* Attribute */}
                    <div className="bg-white mt-4 w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                        <div className="p-6  rounded-md">
                            <h5 className="text-xl font-semibold mb-4">Product Variation</h5>

                            <div className="sm:col-span-2 ">
                                <select
                                    className="w-full  border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    name="attribute"
                                    value={productData.attribute}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" className="text-body dark:text-bodydark">Select attribute</option>
                                </select>
                            </div>
                        </div>
                    </div>



                    {/* proice stock and description */}
                    <div className='flex lg:flex-row flex-col gap-3'>

                        {/* stock */}
                        <div className="bg-white shadow-lg rounded-md  dark:bg-black  mt-5 grid lg:w-[60%] w-full">
                            <div className="col-span-2 p-3">
                                <div className="p-6 bg-white  dark:bg-black   ">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="text-xl font-semibold">Price and Stock Information</h5>
                                    </div>

                                    <div className=" ">
                                        <SelectGroupTwo />
                                    </div>

                                    {/* Unit Price */}
                                    <div className="col-span-12 mt-5">
                                        <div className="grid grid-cols-12 gap-4 mb-4">
                                            <label className="col-span-3 text-gray-700 text-sm font-medium ">
                                                Unit Price <span className="text-red-500">*</span>
                                            </label>
                                            <div className="col-span-9">
                                                <input
                                                    type="number"
                                                    className=" dark:bg-form-input form-control w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                                                    placeholder="Unit price"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div className="col-span-12">
                                        <div className="grid grid-cols-12 gap-4 mb-4">
                                            <label className="col-span-3 text-gray-700 text-sm font-medium">
                                                Discount <span className="text-red-500">*</span>
                                            </label>
                                            <div className="col-span-9">
                                                <input
                                                    type="number"
                                                    className=" dark:bg-form-input form-control w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 "
                                                    placeholder="Discount"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-12">
                                        <div className="grid grid-cols-12 gap-4 mb-4 ">
                                            <label className=" col-span-3 text-gray-700 text-sm font-medium">
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <div className="col-span-9 ">
                                                <input
                                                    type="number"
                                                    className=" dark:bg-form-input bg-white form-control w-full px-4 py-2 border border-gray-300  rounded-md shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 "
                                                    placeholder="Quantity"
                                                    min="0"
                                                    step="1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* description */}
                        <div className="bg-white shadow-lg rounded-md p-6 dark:bg-black  mt-5  lg:w-[40%] w-full">
                            <h2 className="text-lg font-semibold mb-5">Product Description</h2>
                            <div className="">
                                <QuillEditor
                                    value={productData.description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Enter your description here"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white shadow-lg rounded-md p-6 dark:bg-black mt-5 w-full'>
                        <div className="border-b p-4 mb-4">
                            <h5 className="text-xl font-semibold">{'SEO Meta Tags'}</h5>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-12 gap-4 mb-4">
                                <label className="col-span-3 text-gray-700 text-sm font-medium">
                                    Meta Title <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-9">
                                    <input
                                        type="text"
                                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-form-input"
                                        placeholder="Meta Title"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-4 mb-4">
                                <label className="col-span-3 text-gray-700 text-sm font-medium">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-9">
                                    <textarea
                                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-form-input"
                                        placeholder="Description"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Save Product
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};

export default AddProduct;


