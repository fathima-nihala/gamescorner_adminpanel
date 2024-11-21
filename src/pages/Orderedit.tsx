import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import {
  getOrderDetails,
  updateOrderStatus,
  UpdateOrderStatusPayload,
} from '../slices/OrderSlice';
import { useSnackbar } from 'notistack';

const EditOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'current' | 'edit'>('current');
  const { enqueueSnackbar } = useSnackbar();

  // Redux selectors
  const orderDetails = useSelector((state: RootState) =>
    state.orders.list.find((order) => order._id === id)
  );

  // Form state
  const [formData, setFormData] = useState({
    payment_status: '',
    payment_info_status: '',
    order_status: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (activeTab === 'edit' && orderDetails) {
      setFormData({
        payment_status: orderDetails.payment_status || '',
        payment_info_status: orderDetails.paymentInfo?.status || '',
        order_status: orderDetails.orderStatus || '',
      });
    }
  }, [orderDetails, activeTab]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (id) {
      try {
        await dispatch(
          updateOrderStatus({
            id,
            paymentStatus: formData.payment_status,
            paymentInfoStatus: formData.payment_info_status,
            orderStatus: formData.order_status,
          } as UpdateOrderStatusPayload)
        ).unwrap();
        enqueueSnackbar('Saved successfully!', {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });

        setActiveTab('current');
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to Add Brand. Please try again.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    }
  };

  const handleCancel = () => {
    if (orderDetails) {
      setFormData({
        payment_status: orderDetails.payment_status || '',
        payment_info_status: orderDetails.paymentInfo?.status || '',
        order_status: orderDetails.orderStatus || '',
      });
    }
    setActiveTab('current');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Payment Management</h1>
        <p className="text-gray-500">{orderDetails?._id}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 text-center ${activeTab === 'current'
            ? 'font-semibold text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500'
            }`}
        >
          Current Status
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2 text-center ${activeTab === 'edit'
            ? 'font-semibold text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500'
            }`}
        >
          Edit Status
        </button>
      </div>

      {activeTab === 'current' && orderDetails && (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-form-input rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Payment Status</h3>
            <p className="mt-2 text-gray-800">{orderDetails.payment_status}</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-form-input rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Payment Info Status</h3>
            <p className="mt-2 text-gray-800">{orderDetails.paymentInfo?.status}</p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-form-input rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Order Status</h3>
            <p className="mt-2 text-gray-800">{orderDetails.orderStatus}</p>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Status</label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-form-input"
            >
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Info Status</label>
            <select
              name="payment_info_status"
              value={formData.payment_info_status}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-form-input"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Status</label>
            <select
              name="order_status"
              value={formData.order_status}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-form-input"
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 "
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditOrderPage;
