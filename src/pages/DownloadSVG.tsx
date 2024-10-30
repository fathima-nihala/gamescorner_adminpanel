export const DownloadSVG = (products: any[]) => {
    const csvContent = [
        [
            'Index', 'Name', 'Product Type', 'Parent Category', 'Brand',
            'Unit', 'Weight', 'Tags', 'Attribute',  'Color',
            'Today\'s Deal', 'Featured', 'Cash on Delivery',
            'Quantity', 'Shipping Time', 'Tax', 'Description', 'Country Pricing',
        ],
        ...products.map((product, index) => [
            index + 1,
            `"${product.name}"`,
            `"${product.product_type}"`,
            `"${product.parent_category?.parent_category || ''}"`,
            `"${product.brand?.name || ''}"`,
            `"${product.unit || ''}"`,
            `"${product.weight || ''}"`,
            `"${product.tags || ''}"`,
            `"${product.attribute?.name || ''}"`,
            `"${product.color?.map((col: any) => col.name).join('; ') || ''}"`,
            product.todaysDeal ? 'Yes' : 'No',
            product.featured ? 'Yes' : 'No',
            product.cash_on_delivery ? 'Yes' : 'No',
            `"${product.quantity || ''}"`,
            `"${product.shipping_time || ''}"`,
            `"${product.tax || ''}"`,
            `"${product.description.replace(/"/g, '""') || ''}"`,
            product.country_pricing
                .map((country: any) =>
                    `"${country.country_id}, ${country.country}, ${country.currency}, ${country.currency_code}, ${country.unit_price}, Discount: ${country.discount}"`
                )
                .join(' | ')
        ]),
    ]
        .map((e) => e.join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'GamesCorner_products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
