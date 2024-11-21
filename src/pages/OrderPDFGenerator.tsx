import React from 'react';
import html2pdf from 'html2pdf.js';
import { useSnackbar } from 'notistack';
import { Download } from 'lucide-react';
import logo from '../images/logo/games.png';
import { Order } from '../slices/OrderSlice';

interface OrderPDFGeneratorProps {
  order: Order;
}

const OrderPDFGenerator: React.FC<OrderPDFGeneratorProps> = ({ order }) => {
  const { enqueueSnackbar } = useSnackbar();

  const generatePDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="p-8 font-sans bg-white shadow-lg rounded-lg">
        <!-- Logo Section -->
        <div class="flex justify-center mb-6">
          <img src="${logo}" alt="Logo" class="h-16 w-auto" />
        </div>

        <h2 class="text-4xl font-semibold  text-gray-800 text-center mb-6">Order Details</h2>
        <hr class="my-6 border-gray-300" />

        <div class="mb-6">
          <h3 class="text-2xl font-semibold text-gray-800">Order Information</h3>
          <div class="space-y-4 text-lg text-gray-600">
            <p><strong>Order ID:</strong> ${order?.orderID || 'N/A'}</p>
            <p><strong>Customer ID:</strong> ${order?.user?.customerId || 'N/A'}</p>
            <p><strong>Order Status:</strong> ${order?.orderStatus || 'N/A'}</p>
            <p><strong>Payment Type:</strong> ${order?.paymentInfo?.type || 'N/A'}</p>
            <p><strong>Payment Status:</strong> ${order?.payment_status || 'N/A'}</p>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-2xl font-semibold text-gray-800">Order Items</h3>
          <table class="min-w-full table-auto mt-4 border-collapse text-gray-700">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-6 py-3 border-b text-left">Item #</th>
                <th class="px-6 py-3 border-b text-left">Product Details</th>
                <th class="px-6 py-3 border-b text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${order?.orderItems?.map(
                (item, index) => `
                  <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-3">${index + 1}</td>
                    <td class="px-6 py-3">${item.product.name || 'N/A'}</td>
                    <td class="px-6 py-3">${item.quantity || 0}</td>
                  </tr>
                `
              ).join('') || `
                <tr>
                  <td colspan="3" class="text-center py-4 text-gray-500">No items found.</td>
                </tr>
              `}
            </tbody>
          </table>

          <div class="flex justify-end text-lg text-gray-700 mt-4">
            <p class="font-semibold text-gray-800 mr-2">Tax:</p>
            <p class="font-bold  text-gray-800">$${Number(order?.taxPrice || 0).toFixed(2)}</p>
          </div> 
          <div class="flex justify-end text-lg text-gray-700 mt-4">
            <p class="font-semibold text-gray-800 mr-2">Shipping Price:</p>
            <p class="font-bold  text-gray-800">$${Number(order?.shippingPrice || 0).toFixed(2)}</p>
          </div>
          <div class="flex justify-end text-lg text-gray-700 mt-4">
            <p class="font-semibold text-gray-800 mr-2">Total Discount:</p>
            <p class="font-bold  text-gray-800">$${Number(order?.totalDiscount || 0).toFixed(2)}</p>
          </div>
          <div class="flex justify-end text-lg text-gray-700 mt-4">
            <p class="font-semibold text-gray-800 mr-2">Total Amount:</p>
            <p class="font-bold  text-gray-800">$${Number(order?.totalPrice || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `order-${order.orderID}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save()
      .then(() => {
        enqueueSnackbar('PDF downloaded successfully!', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      })
      .catch(() => {
        enqueueSnackbar('Failed to download PDF', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      });
  };

  return (
    <button
      onClick={generatePDF}
      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center w-10 h-10"
    >
      <Download className="w-4 h-4" />
    </button>
  );
};

export default OrderPDFGenerator;