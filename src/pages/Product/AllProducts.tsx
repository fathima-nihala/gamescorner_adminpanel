import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Search,
    Edit,
    Trash,
    Printer,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    fetchProducts,
    deleteProduct,
    editProduct,
} from '../../slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useSnackbar } from 'notistack';
import ConfirmationModal from '../../shared/ConfirmationModal';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';

interface Product {
    _id: string;
    name: string;
    product_type: string;
    quantity: string;
    image: string;
    todaysDeal: boolean;
    featured: boolean;
    country_pricing: Array<{
        country: string;
        currency: string;
        unit_price: number;
        discount: number;
    }>;
    description: string;
    tags: string;
}

const ITEMS_PER_PAGE = 10;

const AllProducts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector<RootState, { products: Product[]; loading: boolean; error: string | null; }>((state) => state.product);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { enqueueSnackbar } = useSnackbar();
    const [delOpen, setDelOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(fetchProducts({ name: searchTerm }));
    }, [dispatch, searchTerm, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const toggleFeatured = async (product: Product): Promise<void> => {
        const formData = new FormData();
        formData.append('featured', (!product.featured).toString());
        await dispatch(editProduct({ id: product._id, formData }));
        dispatch(fetchProducts({ name: searchTerm }));
    };

    const toggleTodaysDeal = async (product: Product): Promise<void> => {
        const formData = new FormData();
        formData.append('todaysDeal', (!product.todaysDeal).toString());
        await dispatch(editProduct({ id: product._id, formData }));
        dispatch(fetchProducts({ name: searchTerm }));
    };

    const delHandleClose = () => {
        setDelOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedItem(product);
        setDelOpen(true);
    };

    const onDelete = async () => {
        if (selectedItem) {
            try {
                await dispatch(deleteProduct(selectedItem._id)).unwrap();
                dispatch(fetchProducts({ name: searchTerm }));
                enqueueSnackbar('Product deleted successfully!', {
                    variant: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            } catch (error: any) {
                console.error("Delete error:", error);
                enqueueSnackbar('Failed to delete the product.', {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                });
            }
        }
        delHandleClose();
    };

    const handlePrint = (): void => {
        window.print();
    };

    const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="All Products" />

            <div className="min-h-screen bg-gray-100">
                <div className="p-4 md:p-2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className='flex p-2 justify-between'>
                            <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-6">
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="border rounded-md px-4 py-2 w-full"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center space-x-3 p-3 bg-blue-400 text-white hover:bg-blue-600 transition"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Print</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="w-8 pb-3"></th>
                                            <th className="pb-3 text-black">Index</th>
                                            <th className="pb-3 text-black">Name</th>
                                            <th className="pb-3 text-black">Type</th>
                                            <th className="pb-3 text-black">Qty</th>
                                            <th className="pb-3 text-center text-black">Today's Deal</th>
                                            <th className="pb-3 text-center text-black">Featured</th>
                                            <th className="pb-3 text-center text-black">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((product, index) => (
                                            <tr key={product._id} className="border-b hover:bg-gray-50">
                                                <td className="py-4"></td>
                                                <td className="py-4 text-sm text-black">
                                                    {indexOfFirstProduct + index + 1}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <span className="text-sm font-medium text-black">
                                                            {product.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-sm text-black">{product.product_type}</td>
                                                <td className="py-4 text-sm text-black">
                                                    {product.quantity}
                                                </td>
                                                <td className="py-4 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <div
                                                            className={`w-12 h-6 rounded-full ${product.todaysDeal ? "bg-green-500" : "bg-gray-300"}`}
                                                            onClick={() => toggleTodaysDeal(product)}
                                                        >
                                                            <div className={`h-6 w-6 bg-white rounded-full transform ${product.todaysDeal ? "translate-x-6" : "translate-x-0"}`}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <div
                                                            className={`w-12 h-6 rounded-full ${product.featured ? "bg-green-500" : "bg-gray-300"}`}
                                                            onClick={() => toggleFeatured(product)}
                                                        >
                                                            <div className={`h-6 w-6 bg-white rounded-full transform ${product.featured ? "translate-x-6" : "translate-x-0"}`}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <button
                                                        className="text-blue-500 hover:underline"
                                                        onClick={() => navigate(`/edit-product/${product._id}`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:underline ml-2"
                                                        onClick={() => handleDeleteClick(product)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`bg-gray-200 text-gray-600 p-2 rounded ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                    >
                                        <ChevronLeft />
                                    </button>
                                    <span>Page {currentPage} of {totalPages}</span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`bg-gray-200 text-gray-600 p-2 rounded ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                    >
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                delOpen={delOpen}
                delHandleClose={delHandleClose}
                onDelete={onDelete}
            />

        </>
    );
};

export default AllProducts;

