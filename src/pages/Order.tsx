import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Search, Printer, Eye } from 'lucide-react';

type Order = {
  id: number;
  orderNumber: string;
  customerId: string;
  productName: string;
  brand: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
};

const OrdersTable: React.FC = () => {
  const orders: Order[] = [
    { id: 1, orderNumber: '#12345', customerId: 'C100', productName: 'Product 1', brand: 'Brand 1', status: 'Completed' },
    { id: 2, orderNumber: '#12346', customerId: 'C101', productName: 'Product 2', brand: 'Brand 2', status: 'Completed' },
    { id: 3, orderNumber: '#12347', customerId: 'C102', productName: 'Product 3', brand: 'Brand 3', status: 'Completed' },
  ];

  return (
    <>
      <Breadcrumb pageName="Order" />

      <div className="p-4 sm:p-6 min-h-screen ">

        {/* White Background Container */}
        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-form-input">
          
          {/* Search and Print Section */}
          <div className="  flex flex-col sm:flex-row justify-between items-center p-4 space-y-4 sm:space-y-0 ">
            <div className="relative w-full sm:w-1/3 ">
              <input
                type="text"
                placeholder="Search orders..."
                className=" bg-white dark:bg-form-input p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-150"
            >
              <Printer />
              <span>Print</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto ">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white  dark:bg-form-input">
                  <th className="p-2  sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100   ">
                    No
                  </th>
                  <th className="p-2 sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100">
                    Order
                  </th>
                  <th className="p-2 sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100">
                    Customer ID
                  </th>
                  <th className="p-2 sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100">
                    Product Name
                  </th>
                  <th className="p-2 sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100">
                    Brand
                  </th>
                  <th className="p-2 sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100">
                    Status
                  </th>
                  <th className="p-2 sm:p-4 text-left text-gray-700 font-medium uppercase tracking-wider border-b border-gray-100">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="p-2 sm:p-4 text-left border-b border-gray-100">{order.id}</td>
                    <td className="p-2 sm:p-4 text-left border-b border-gray-100">{order.orderNumber}</td>
                    <td className="p-2 sm:p-4 text-left border-b border-gray-100">{order.customerId}</td>
                    <td className="p-2 sm:p-4 text-left border-b border-gray-100">{order.productName}</td>
                    <td className="p-2 sm:p-4 text-left border-b border-gray-100">{order.brand}</td>
                    <td className={`p-2 sm:p-4 text-left border-b border-gray-100 ${order.status === 'Completed' ? 'text-green-700' : 'text-red-700'}`}>
                      {order.status}
                    </td>
                    <td className="p-2 sm:p-4 text-left border-b border-gray-100">
                      <button className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-blue-600 transition-colors duration-150">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
