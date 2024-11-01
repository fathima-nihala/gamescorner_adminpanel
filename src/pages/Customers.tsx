import React from "react";

type Customer = {
  id: number;
  email: string;
  name: string;
};

const Customers: React.FC = () => {
  const customerData: Customer[] = [
    { id: 1, email: "example@example.com", name: "John Doe" },
    { id: 2, email: "sample@sample.com", name: "Jane Smith" },
    { id: 3, email: "sample2@sample.com", name: "Alex Johnson" }
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white dark:bg-form-input shadow-lg rounded-lg">
        <div className="p-4 border-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Customers List
          </h2>
        </div>
        <div className="overflow-x-auto sm:overflow-x-hidden p-4">
          <table className="min-w-full bg-white dark:bg-form-input rounded-lg">
            <thead>
              <tr className="bg-blue-50 dark:bg-form-input">
                <th className="px-4 sm:px-6 py-4 w-1/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Index
                </th>
                <th className="px-4 sm:px-6 py-4 w-4/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-4 w-4/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-4 w-3/12 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Option
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerData.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white dark:bg-form-input"
                  } hover:bg-blue-50 dark:bg-form-input dark:hover:bg-gray-700 transition duration-150`}
                >
                  <td className="px-4 sm:px-6 py-4 w-1/12 text-left text-sm font-medium text-gray-900 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-4 w-4/12 text-left text-sm text-gray-600 dark:text-gray-400">
                    {customer.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 w-4/12 text-left text-sm text-gray-600 dark:text-gray-400">
                    {customer.name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 w-3/12 text-left text-sm font-medium">
                    <button className="text-red-600 hover:text-red-700 transition duration-150">
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
  );
};

export default Customers;
