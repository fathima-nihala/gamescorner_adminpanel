import React from 'react';
import { Search, Eye, Edit, Download, Trash, ChevronDown, Printer } from 'lucide-react';

type Order = {
  id: number;
  orderNumber: string;
  customerId: string;
  productName: string;
  noOfProducts: number;
  amount: number;
  deliveryStatus: string;
  paymentMethod: string;
};

const OrdersTable: React.FC = () => {
  const orders: Order[] = [
    { id: 1, orderNumber: '#12345', customerId: 'C100', productName: 'Product 1', noOfProducts: 3, amount: 150, deliveryStatus: 'Delivered', paymentMethod: ' Cash on Delivery' },
    { id: 2, orderNumber: '#12346', customerId: 'C101', productName: 'Product 2', noOfProducts: 1, amount: 50, deliveryStatus: 'Pending', paymentMethod: 'Cash on Delivery' },
    { id: 3, orderNumber: '#12347', customerId: 'C102', productName: 'Product 3', noOfProducts: 2, amount: 75, deliveryStatus: 'Cancelled', paymentMethod: 'Cash on Delivery' },
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="bg-white dark:bg-form-input rounded-lg shadow-md p-6">
        {/* Search and Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-white dark:bg-form-input p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Delivery Status Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-form-input border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select order status</option>
                <option value="all">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            {/* Payment Method Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-form-input border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment status</option>
                <option value="all">Paid</option>
                <option value="cash on delivery">Unpaid</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white dark:bg-form-input font-semibold rounded-md hover:bg-blue-700 transition-colors duration-150"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">No</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Order</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">No of Products</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Customer ID</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Product Name</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Amount</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Delivery Status</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Payment Method</th>
                <th className="p-4 text-left text-gray-700 font-medium border-b border-gray-100 no-underline">Options</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className=" p-4 border-b border-gray-100 no-underline">{order.id}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">{order.orderNumber}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">{order.noOfProducts}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">{order.customerId}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">{order.productName}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">${order.amount.toFixed(2)}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.deliveryStatus === 'Delivered' ? 'bg-green-100 dark:bg-form-input text-green-600' :
                      order.deliveryStatus === 'Pending' ? 'bg-yellow-100 dark:bg-form-input text-yellow-600' :
                      'bg-red-100 dark:bg-form-input text-red-600'
                    }`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-100 no-underline">{order.paymentMethod}</td>
                  <td className="p-4 border-b border-gray-100 no-underline">
                    <div className="flex space-x-4 justify-center">
                      {/* Eye Icon inside circle */}
                      <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 group flex justify-center items-center w-8 h-8 no-underline">
                        <Eye className="w-4 h-4 group-hover:text-blue-800 transition-colors duration-200" />
                      </button>
                      {/* Edit Icon inside circle */}
                      <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 group flex justify-center items-center w-8 h-8 no-underline">
                        <Edit className="w-4 h-4 group-hover:text-yellow-800 transition-colors duration-200" />
                      </button>
                      {/* Download Icon inside circle */}
                      <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 group flex justify-center items-center w-8 h-8 no-underline">
                        <Download className="w-4 h-4 group-hover:text-green-800 transition-colors duration-200" />
                      </button>
                      {/* Trash Icon inside circle */}
                      <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 group flex justify-center items-center w-8 h-8 no-underline">
                        <Trash className="w-4 h-4 group-hover:text-red-800 transition-colors duration-200" />
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
  );
};

export default OrdersTable;
