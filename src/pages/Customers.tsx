import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomer,
  clearCustomerError,
} from "../slices/customerSlice";
import { AppDispatch, RootState } from "../redux/store";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";

const Customers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDelete = (customerId: string) => {
    dispatch(clearCustomerError());
    dispatch(deleteCustomer(customerId));
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Breadcrumb pageName="Customer" />
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="bg-white dark:bg-form-input shadow-lg rounded-lg">
          <div className="overflow-x-auto sm:overflow-x-hidden p-4">
            <table className="min-w-full bg-white dark:bg-form-input rounded-lg">
              <thead>
                <tr className="bg-blue-50 dark:bg-slate-700">
                  <th className="px-4 py-4 w-1/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Index
                  </th>
                  <th className="px-4 py-4 w-1/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    CustomerId
                  </th>
                  <th className="px-4 py-4 w-4/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-4 py-4 w-4/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-4 py-4 w-3/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Option
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers?.map((customer, index) => (
                  <tr
                    key={customer._id}
                    className={`${index % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white dark:bg-form-input"
                      } hover:bg-slate-50 dark:bg-form-input dark:hover:bg-gray-700 transition duration-150`}
                  >
                    <td className="px-4 py-4 w-1/12 text-left text-[16px] font-medium text-gray-900 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 w-1/12 text-left text-[15px] font-medium text-gray-900 dark:text-gray-300">
                      {customer.customerId}
                    </td>
                    <td className="px-4 py-4 w-4/12 text-left text-[16px] text-gray-600 dark:text-gray-400">
                      {customer.email}
                    </td>
                    <td className="px-4 py-4 w-4/12 text-left text-[16px] text-gray-600 dark:text-gray-400">
                      {customer.name}
                    </td>
                    <td className="px-4 py-4 w-3/12 text-left text-[16px] font-medium">
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-red-600 hover:text-red-700 dark:hover:text-white transition duration-150"
                      >
                        Remove
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

export default Customers;
