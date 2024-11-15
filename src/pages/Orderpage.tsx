import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, selectOrders, selectTotalAmount, selectOrderLoading, selectOrderError } from '../slices/OrderSlice'; // Adjust the path accordingly
import {  User,Mail, ShoppingBag } from "lucide-react";
import { AppDispatch, RootState } from "../redux/store";
import { useParams } from "react-router-dom";

const OrderPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const orders = useSelector(selectOrders);
    const totalAmount = useSelector(selectTotalAmount);
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const { list } = useSelector((state: RootState) => state.orders);
    const filterList = list.find((li) => li._id === id);

    console.log(filterList, 'ffff');


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const formattedDate = filterList?.createdAt
        ? new Date(filterList.createdAt).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>

    return (
        <div className="p-6 bg-slate-50 dark:bg-form-input  min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="text-lg font-semibold">
                    {filterList?.orderID}<span className="ml-2 text-yellow-500">{filterList?.payment_status}</span>
                    <span className="ml-1 text-red-500">{filterList?.orderStatus}</span>
                    <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>

                </div>

            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-form-input p-4 rounded-md shadow">

                            {order.orderItems.map((item, index) => (
                                <div>
                                    <div className="flex justify-between items-center">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <span className="text-red-500">{order.payment_status}</span>
                                    </div>
                                    <p className="text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: item.product.description }}></p>
                                    <div key={index} className="flex items-center space-x-4">
                                        <img
                                            src={item.product.image}
                                            alt="Product"
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div>
                                            <h3 className="font-medium">{item.product.name}</h3>
                                            <p className="text-gray-500">Medium · Black</p>
                                            <p>{item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-form-input p-6 rounded-md shadow h-64">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">Order Summary</h2>
                            <span className="text-yellow-500">Payment pending</span>
                        </div>
                        <p className="text-gray-500 mb-4">Use this personalized guide to get your store up and running.</p>
                        <div className="text-sm text-gray-700">
                            <p className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>{orders.length} item</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </p>
                            {/* Other order summary details */}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customers */}
                    <div className="bg-white dark:bg-form-input p-4 rounded-md shadow h-40">
                        <h3 className="font-semibold">Customers</h3>
                        <div className="mt-2 flex items-center">
                            <User className="text-gray-500 w-5 h-5 mr-2" />
                            <p className="text-gray-500">Alex Jander</p>
                        </div>
                        <div className="mt-2 flex items-center">
                            <ShoppingBag className="text-gray-500 w-5 h-5 mr-1" />
                            <p className="text-sm text-gray-400">1 Order</p>
                        </div>
                        <p className="text-sm text-gray-400">Customer is tax-exempt</p>
                    </div>

                      {/* Contact Information */}
          <div className="bg-white dark:bg-form-input p-4 rounded-md shadow h-40">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Contact Information</h3>
                <div className="mt-2 flex items-center">
                  <Mail className="text-gray-500 w-5 h-5 mr-2" />
                  <p className="text-gray-500">alexjander@gmail.com</p>
                </div>
                <p className="text-gray-400">No phone number</p>
              </div>
            </div>
          </div>
          {/* Shipping Address */}
          <div className="bg-white dark:bg-form-input p-4 rounded-md shadow h-56">
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-center">
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <User className="text-gray-500 w-5 h-5 mr-2" />
              <p className="text-gray-500">Alex Jander</p>
            </div>
            <p className="text-gray-500 mt-2">1226 University Drive</p>
            <p className="text-gray-500 mt-2">Menlo Park</p>
            <p className="text-gray-500 mt-2">United States</p>
            <p className="text-gray-500 mt-2">+123456789</p>
          </div>
          {/* Billing Address */}
          <div className="bg-white dark:bg-form-input p-4 rounded-md shadow">
            <div className="flex justify-between items-start p-4">
              <div>
                <h3 className="font-semibold">Billing Address</h3>
                <p className="text-gray-500">Same as Shipping Address</p>
              </div>
            </div>
          </div>
          
                    {/* Additional customer or shipping information */}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
