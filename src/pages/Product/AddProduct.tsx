import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import React, { useState } from 'react';
import SwitcherThree from '../../components/Switchers/SwitcherThree';
import DropzoneImage from '../../shared/DropzoneImage';

interface ProductData {
    name: string;
    productType: string;
    categoryId: string;
    brandId?: string;
    unit?: string;
    weight?: string;
    tags?: string;
}

const AddProduct: React.FC = () => {
    const [productData, setProductData] = useState<ProductData>({
        name: '',
        productType: 'Physical',
        categoryId: '',
        brandId: '',
        unit: '',
        weight: '',
        tags: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewGallery, setPreviewGallery] = useState<(string | null)[]>([null, null, null, null, null]);

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (fieldName === 'image') {
                const result = reader.result as string;
                setPreviewImage(result);
                setProductData((prevData) => ({ ...prevData, image: file }));
            } else if (fieldName.startsWith('gallery')) {
                const index = parseInt(fieldName.slice(-1)) - 1;
                const result = reader.result as string;
                const newPreviewGallery = [...previewGallery];
                newPreviewGallery[index] = result;
                setPreviewGallery(newPreviewGallery);
                setProductData((prevData) => ({ ...prevData, [fieldName]: file }));
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

            <div className="p-4 bg-gray-100 min-h-screen">
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
                                            name="productType"
                                            value={productData.productType}
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
                                    <div className="sm:col-span-2 ">
                                        <select
                                            className="w-full  border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                            name="categoryId"
                                            value={productData.categoryId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" className="text-body dark:text-bodydark">Select Category</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <label className="text-gray-700 text-sm font-medium">Brand</label>
                                    <div className="sm:col-span-2">
                                        <select
                                            className="w-full  border border-gray-300 rounded-md border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                            name="brandId"
                                            value={productData.brandId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Brand</option>
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

                        <div className='lg:w-[30%] w-full flex lg:flex-col flex-row gap-4'>

                            {/* Cash on Delivery Box */}
                            <div className="bg-white  rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                                <h5 className="text-xl font-semibold mb-4">Cash on Delivery</h5>
                                <SwitcherThree />
                            </div>

                            {/* Estimated Shipping Time Box */}
                            <div className="bg-white text-graydark dark:text-white dark:bg-black p-6 shadow-lg rounded-md border-none ">
                                <h5 className="text-xl font-semibold mb-4">Estimated Shipping Time</h5>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    name="estimated_shipping_time"
                                    placeholder="Enter estimated shipping time"
                                />
                            </div>

                            {/* VAT & TAX */}
                            <div className="lg:col-span-2 ">
                                <div className="bg-white text-graydark dark:text-white dark:bg-black p-6 shadow-lg rounded-md">
                                    <h5 className="text-xl font-semibold mb-4">VAT & TAX</h5>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="bg-white mt-4  w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                        <div className='block w-full ml-4 xl:mt-14 lg:mt-24 md:mt-28 mt-56'>
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


                    <div className="bg-white mt-4 w-full rounded-lg shadow-md p-6 text-graydark dark:text-white dark:bg-black ">
                            <div className="p-6  rounded-md">
                                <h5 className="text-xl font-semibold mb-4">Product Variation</h5>
                            </div>
                    </div> 



                </form>
            </div>
        </>
    );
};

export default AddProduct;


