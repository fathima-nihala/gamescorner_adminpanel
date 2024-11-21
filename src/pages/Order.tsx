import React, { useEffect, useState } from 'react';
import { Search, Eye, Edit, Trash, ChevronDown, Printer } from 'lucide-react';
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


const OrdersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  const [orderStatus, setOrderStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchOrders(undefined));
  }, [dispatch]);

  const handleFilterChange = () => {
    const filters: { orderStatus?: string; payment_status?: string } = {};
    if (orderStatus) filters.orderStatus = orderStatus;
    if (paymentStatus) filters.payment_status = paymentStatus;
    dispatch(fetchOrders(Object.keys(filters).length ? filters : undefined));
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


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              className="bg-white dark:bg-form-input p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <div className="relative w-full sm:w-auto min-w-[10rem]">
              <select
                value={orderStatus}
                onChange={(e) => {
                  setOrderStatus(e.target.value);
                  handleFilterChange();
                }}
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
                onChange={(e) => {
                  setPaymentStatus(e.target.value);
                  handleFilterChange();
                }}
                className="appearance-none bg-white dark:bg-form-input border border-gray-300 rounded-md px-6 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select payment status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-150"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
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
              {orders.map((order: Order, index) => (
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
                        ? "text-white bg-green-600"
                        : order.orderStatus === "Processing"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
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
                        ? "bg-green-100 text-green-600"
                        : order.payment_status === "Unpaid"
                          ? "bg-yellow-100 text-yellow-600"
                          : "text-white bg-red-600"
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
      </div>
    </div>

  )
}

export default OrdersTable;
