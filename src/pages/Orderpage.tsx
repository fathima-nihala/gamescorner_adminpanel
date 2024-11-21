import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, selectOrderLoading, selectOrderError } from '../slices/OrderSlice'; // Adjust the path accordingly
import { User, Mail, ShoppingBag, Phone } from "lucide-react";
import { AppDispatch, RootState } from "../redux/store";
import { useParams } from "react-router-dom";

const OrderPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const { list } = useSelector((state: RootState) => state.orders);
    const filterList = list.find((li) => li._id === id);



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

    console.log(filterList);



    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-700  min-h-screen">
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
                    {filterList?.orderItems?.map((item, index) => {
                        return (
                            <div key={index} className="bg-white dark:bg-form-input p-4 rounded-md shadow">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <span
                                        className={
                                            filterList.payment_status === "Paid"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }
                                    >
                                        {filterList.payment_status}
                                    </span>
                                </div>
                                <p
                                    className="text-gray-500 mb-4"
                                    dangerouslySetInnerHTML={{ __html: item.product.description }}
                                ></p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.product.image}
                                            alt="Product"
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div>
                                            <div>
                                                <h3 className="font-medium">{item.product.name}</h3>
                                                <p className="text-gray-500">Item: {item.quantity}</p>
                                                <p className="text-gray-500">
                                                    Shipping Price: {item.currency_code}{" "}
                                                    {(item.quantity * (item.product.shipping_price || 0)).toFixed(2)}
                                                </p>
                                                <p className="text-gray-500">Price: {item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Calculate and display total item cost */}
                                    <div className="text-right mt-5">
                                        <p className="font-medium">
                                            Total: {item.currency_code} {(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}



                    {/* Order Summary */}
                    <div className="bg-white dark:bg-form-input p-6 rounded-md shadow ">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">Order Summary</h2>
                        </div>
                        <p className="text-gray-500 mb-4">Review the details of your order, including taxes and shipping costs.</p>
                        <div className="text-sm text-gray-700">
                            <p className="flex justify-between mb-2">
                                <span>Price</span>
                                <span>{filterList?.orderItems?.[0]?.currency_code} {filterList?.itemsPrice || '0.00'}</span>
                            </p>
                            <p className="flex justify-between mb-2">
                                <span>Discount Price</span>
                                <span>{filterList?.orderItems?.[0]?.currency_code} {filterList?.totalDiscount || '0.00'}</span>
                            </p>
                            <p className="flex justify-between mb-2">
                                <span>Tax</span>
                                <span>{filterList?.orderItems?.[0]?.currency_code} {filterList?.taxPrice || '0.00'}</span>
                            </p>
                            <p className="flex justify-between mb-2">
                                <span>Shipping</span>
                                <span>
                                    {filterList?.shippingPrice ? (
                                        <>{filterList?.orderItems?.[0]?.currency_code} {filterList?.shippingPrice}</>
                                    ) : (
                                        <span className="text-green-500">Free Delivery</span>
                                    )}
                                </span>

                            </p>
                            <hr className="my-2" />
                            <p className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{filterList?.orderItems?.[0]?.currency_code} {filterList?.totalPrice}</span>
                            </p>
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
                            <p className="text-gray-500">{filterList?.user?.name}</p>
                        </div>
                        <div className="mt-4 flex items-center">
                            <ShoppingBag className="text-gray-500 w-5 h-5 mr-1" />
                            <p className="text-sm text-gray-400">{filterList?.orderItems?.length}</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-form-input p-4 rounded-md shadow h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">Contact Information</h3>
                                <div className="mt-2 flex items-center">
                                    <Mail className="text-gray-500 w-5 h-5 mr-2" />
                                    <p className="text-gray-500">{filterList?.user.email}</p>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <Phone className="text-gray-500 w-5 h-5 mr-2" />
                                    <p className="text-gray-400">{filterList?.shippingAddress?.phoneNo}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-form-input p-4 rounded-md shadow ">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center justify-center">
                                <h3 className="font-semibold">Shipping Address</h3>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center">
                            <User className="text-gray-500 w-5 h-5 mr-2" />
                            <p className="text-gray-500">{filterList?.shippingAddress?.name}</p>
                        </div>
                        <p className="text-gray-500 mt-2">{filterList?.shippingAddress?.address}</p>
                        <p className="text-gray-500 mt-2">{filterList?.shippingAddress?.city}</p>
                        <p className="text-gray-500 mt-2">{filterList?.shippingAddress?.state}</p>
                        <p className="text-gray-500 mt-2">{filterList?.shippingAddress?.country}</p>
                        <p className="text-gray-500 mt-2">{filterList?.shippingAddress?.pinCode}</p>
                        <p className="text-gray-500 mt-2">{filterList?.shippingAddress?.phoneNo}</p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default OrderPage;

