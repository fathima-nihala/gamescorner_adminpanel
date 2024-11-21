import React, { useEffect, useState } from 'react';
import { Search, Eye, Edit, Trash, ChevronDown, Printer, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchOrders,
  selectOrders,
  selectOrderLoading,
  selectOrderError,
  deleteOrder as deleteOrderAction,
  type Order
} from '../slices/OrderSlice';
import type { AppDispatch } from '../redux/store';
import { useSnackbar } from 'notistack';
import OrderPDFGenerator from './OrderPDFGenerator';
import { DownloadOrderSVG } from './DownloadOrderSVG';

const ITEMS_PER_PAGE = 20;

const OrdersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Debounce search to reduce unnecessary API calls
  useEffect(() => {
    dispatch(fetchOrders({ orderID: '' }));
  }, [dispatch]);


  const filteredOrders = orders.filter((order) => {
    const matchesSearchQuery = order.orderID.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrderStatus = !orderStatus || order.orderStatus === orderStatus;
    const matchesPaymentStatus = !paymentStatus || 
      order.payment_status.toLowerCase() === paymentStatus.toLowerCase();

    return matchesSearchQuery && matchesOrderStatus && matchesPaymentStatus;
  });


   // Pagination logic
   const indexOfLastOrder = currentPage * ITEMS_PER_PAGE;
   const indexOfFirstOrder = indexOfLastOrder - ITEMS_PER_PAGE;
   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
   const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (orderId: string) => {
    try {
      const resultAction = await dispatch(deleteOrderAction(orderId));

      if (deleteOrderAction.fulfilled.match(resultAction)) {
        enqueueSnackbar('Order deleted successfully!', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
        dispatch(fetchOrders());
      } else {
        enqueueSnackbar(resultAction.payload || 'Access denied! admin only', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Something went wrong!', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

   // Pagination Component
   const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }> = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
      const pageNumbers = [];

      // Previous button
      pageNumbers.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      );

      // First page button
      pageNumbers.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            currentPage === 1 ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'
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
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === i ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'
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
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === totalPages ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'
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

  // Loading and Error States
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
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="bg-white dark:bg-form-input rounded-lg shadow-md p-6">
        {notification && (
          <div className="mb-4 p-4 text-white bg-green-600 rounded-lg">
            {notification}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search order id..."
             value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white dark:bg-form-input p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <div className="relative w-full sm:w-auto min-w-[10rem]">
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="appearance-none bg-white dark:bg-form-input border border-gray-300 rounded-md px-6 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select order status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            <div className="relative w-full sm:w-auto min-w-[10rem]">
              <select
                value={paymentStatus}
                onChange={handlePaymentStatusChange}
                className="appearance-none bg-white dark:bg-form-input border border-gray-300 rounded-md px-6 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select payment status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            <button
              onClick={() => DownloadOrderSVG(orders)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-150"
            >
              <Printer className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  #
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  Order ID
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  No of Products
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  Customer
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  Amount
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  Status
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  Payment
                </th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100">
                  Payment Status
                </th>
                <th className="p-4 text-gray-700 font-medium border-b border-gray-100 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order: Order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4 border-b border-gray-100">{index + 1}</td>
                  <td className="p-4 border-b border-gray-100">
                    {order.orderID}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-center">
                    {order.orderItems.length}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    {order.user.customerId}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${order.orderStatus === "Delivered"
                        ? "text-white bg-green-400"
                        : order.orderStatus === "Processing"
                        ? "text-white bg-yellow-400"
                        : order.orderStatus === "Shipped"
                        ? "text-white bg-orange-400"
                        : "text-white bg-red-400"
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    {order.paymentInfo.type}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <span
                      className={`px-1 py-1 text-[12px] ${order.payment_status === "Paid"
                        ? "text-white bg-green-400 px-3"
                          : "text-white bg-red-400"
                        }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center w-10 h-10"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/orderedit/${order._id}`)}
                        className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center w-10 h-10"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <OrderPDFGenerator order={order} />
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center w-10 h-10"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>

  )
}

export default OrdersTable;
