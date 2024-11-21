import { Order, OrderItem } from '../slices/OrderSlice'; 

export const DownloadOrderSVG = (orders: Order[]) => {
    const csvContent = [
        [
            'Index', 'Order ID', 'Order Reference', 
            'Customer Name', 'Customer Email', 'Customer ID',
            'Phone Number', 'Total Price', 'Items Price', 
            'Shipping Price', 'Tax Price', 'Total Discount',
            'Payment Method', 'Payment Status', 
            'Order Status', 'Order Date',
            'Shipping Name', 'Shipping Address', 'City', 
            'State', 'Country', 'Pin Code',
            'Products', 'Product Quantities', 'Product Prices',
            'Product Descriptions', 'Product Images'
        ],
        ...orders.map((order, index) => [
            index + 1,
            `"${order.orderID || ''}"`,
            `"${order._id || ''}"`,
            `"${order.user?.name || ''}"`,
            `"${order.user?.email || ''}"`,
            `"${order.user?.customerId || ''}"`,
            `"${order.shippingAddress?.phoneNo || ''}"`,
            `"${order.totalPrice || ''}"`,
            `"${order.itemsPrice || ''}"`,
            `"${order.shippingPrice || ''}"`,
            `"${order.taxPrice || ''}"`,
            `"${order.totalDiscount || ''}"`,
            `"${order.paymentInfo?.type || ''}"`,
            `"${order.payment_status || ''}"`,
            `"${order.orderStatus || ''}"`,
            `"${order.createdAt || ''}"`,
            `"${order.shippingAddress?.name || ''}"`,
            `"${order.shippingAddress?.address || ''}"`,
            `"${order.shippingAddress?.city || ''}"`,
            `"${order.shippingAddress?.state || ''}"`,
            `"${order.shippingAddress?.country || ''}"`,
            `"${order.shippingAddress?.pinCode || ''}"`,
            `"${order.orderItems?.map((item: OrderItem) => item.product.name).join('; ') || ''}"`,
            `"${order.orderItems?.map((item: OrderItem) => item.quantity).join('; ') || ''}"`,
            `"${order.orderItems?.map((item: OrderItem) => item.price).join('; ') || ''}"`,
            `"${order.orderItems?.map((item: OrderItem) => item.product.description).join('; ') || ''}"`,
            `"${order.orderItems?.map((item: OrderItem) => item.product.image).join('; ') || ''}"`,
        ])
    ]
    .map(row => row.map(cell => 
        cell === null || cell === undefined ? '' : cell.toString().replace(/"/g, '')
    ).join(','))
    .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `GamesCorner_orders_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};