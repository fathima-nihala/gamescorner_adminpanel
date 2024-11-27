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
} from '../../slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useSnackbar } from 'notistack';
import ConfirmationModal from '../../shared/ConfirmationModal';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SwitcherOne from '../../components/Switchers/SwitcherOne';
import SwitcherTwo from '../../components/Switchers/SwitcherTwo';
import { DownloadSVG } from "../DownloadSVG";
import EditProduct from './EditProduct';
import SwitcherFour from '../../components/Switchers/SwitcherFour';

interface Category {
    _id: string;
    parent_category: string;
}

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
    // brand: {
    //     _id: string;
    //     name: string;
    // };
    brand: Array<{
        _id: string;
        name: string;
    }>;

    parent_category: Category[];
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];

        // Previous button
        pageNumbers.push(
            <button
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-orange-100  disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
        );

        // First page button
        pageNumbers.push(
            <button
                key={1}
                onClick={() => onPageChange(1)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === 1 ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
            >
                1
            </button>
        );

        // Calculate the range of page numbers to show
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis if necessary
        if (startPage > 2) {
            pageNumbers.push(
                <span key="ellipsis1" className="w-8 h-8 flex items-center justify-center text-gray-500">
                    ...
                </span>
            );
        }

        // Add middle page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === i ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis if necessary
        if (endPage < totalPages - 1) {
            pageNumbers.push(
                <span key="ellipsis2" className="w-8 h-8 flex items-center justify-center text-gray-500">
                    ...
                </span>
            );
        }

        // Last page button
        if (totalPages > 1) {
            pageNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === totalPages ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pageNumbers.push(
            <button
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        );

        return pageNumbers;
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-4">
            {renderPageNumbers()}
        </div>
    );
};

const ITEMS_PER_PAGE = 20;

const AllProducts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector<RootState, { products: Product[]; loading: boolean; error: string | null; }>((state) => state.product);
    const [query, setQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { enqueueSnackbar } = useSnackbar();
    const [delOpen, setDelOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);
    const [editProductId, setEditProductId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        dispatch(fetchProducts({ name: '' }));
    }, [dispatch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

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
                dispatch(fetchProducts({ name: '' }));
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

    const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

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

    const handleOpen = (productId: string) => {
        setOpen(true);
        setEditProductId(productId);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProductId(null);
    };

    return (
        <>
            <Breadcrumb pageName="All Products" />
            <div className="min-h-screen bg-gray-100">
                <div className="p-1 md:p-2">
                    <div className="rounded-sm border border-stroke bg-white  shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className='flex p-2 justify-between'>
                            <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-6">
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="border rounded-md px-4 py-2 w-full bg-white dark:bg-form-input"
                                        value={query}
                                        onChange={handleSearch}
                                    />
                                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => DownloadSVG(products)}
                                    className="flex items-center space-x-3 p-3 bg-green-800 text-white hover:bg-green-600 transition rounded-md"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>CSV</span>
                                </button>
                            </div>
                        </div>
                        <div className="md:p-4 p-2  overflow-x-auto">
                            <div className="min-w-[800px]">
                                <table className="min-w-full  table-auto">
                                    <thead>
                                        <tr className="border-b text-black dark:text-white gap-2">
                                            <th className="w-8 pb-3"></th>
                                            <th className="pb-3 text-start">Index</th>
                                            <th className="pb-3 text-start">Name</th>
                                            <th className="pb-3 text-start">Type</th>
                                            <th className="pb-3 text-start">Brand</th>
                                            <th className="pb-3 text-start">Category</th>
                                            <th className="pb-3 text-start">Qty</th>
                                            <th className="pb-3 text-center">Today's Deal</th>
                                            <th className="pb-3 text-center">Featured</th>
                                            <th className="pb-3 text-center">Publish</th>
                                            <th className="pb-3 text-center">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-black dark:text-white text-[16px]'>
                                        {currentProducts.map((product, index) => (
                                            <tr key={product._id} className="border-b hover:bg-gray-50 ">
                                                <td className="py-4"></td>
                                                <td className="py-4 text-sm ">
                                                    {indexOfFirstProduct + index + 1}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center text-start gap-4">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <span className="font-medium truncate" title={product.name}>
                                                            {product.name.split(' ').slice(0, 4).join(' ')}...
                                                        </span>

                                                    </div>
                                                </td>
                                                <td className="py-4  text-start">{product.product_type}</td>
                                                <td className="py-4  text-start">{product.brand[0]?.name}</td>

                                                <td className="py-4  text-start">
                                                    {/* {product.parent_category.map((category) => (
                                                        <div key={category._id}>
                                                            <p>{category.parent_category}</p>
                                                        </div>
                                                    ))} */}
                                                    {Array.isArray(product.parent_category) ? (
                                                        product.parent_category.map((category) => (
                                                            <div key={category._id}>
                                                                <p>{category.parent_category}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>{product.parent_category}</p>
                                                    )}
                                                </td>

                                                <td className="py-4  text-start">
                                                    {product.quantity}
                                                </td>
                                                <td className="py-4 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <SwitcherOne id={product._id} />
                                                    </div>
                                                </td>

                                                <td className="py-4 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <SwitcherTwo id={product._id} />
                                                    </div>
                                                </td>

                                                <td className="py-4 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <SwitcherFour id={product._id} />
                                                    </div>
                                                </td>

                                                <td className="py-4 text-center flex justify-center items-center">
                                                    <button
                                                        className="p-2 rounded-full bg-white dark:bg-boxdark border border-gray-300 shadow hover:bg-gray-100 "
                                                        onClick={() => handleOpen(product._id)}
                                                    >
                                                        <Edit className="w-4 h-4 text-blue-500" />
                                                    </button>
                                                    <button
                                                        className=" ml-2 p-2 rounded-full bg-white dark:bg-boxdark border border-gray-300 shadow hover:bg-gray-100"
                                                        onClick={() => handleDeleteClick(product)}
                                                    >
                                                        <Trash className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
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

            {!!editProductId && (
                <EditProduct
                    id={editProductId}
                    open={open}
                    handleClose={handleClose}
                />
            )}
        </>
    );
};

export default AllProducts;