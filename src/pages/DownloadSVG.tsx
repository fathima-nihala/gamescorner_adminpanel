export const DownloadSVG = (products: any[]) => {
    const csvContent = [
        [
            'Index', 'Name', 'Product Type', 'Parent Category', 'Sub Category', 'Brand',
            'Unit', 'Weight', 'Tags', 'Attributes', 'Attribute Values', 'Color',
            'Today\'s Deal', 'Featured', 'Cash on Delivery',
            'Quantity', 'Shipping Time', 'Tax', 'Description', 'Meta Title', 'Meta Description',
            'Country Pricing', 'Gallery Images'
        ],
        ...products.map((product, index) => [
            index + 1,
            `"${product.name || ''}"`,
            `"${product.product_type || ''}"`,
            `"${product.parent_category?.[0]?.parent_category || ''}"`,
            `"${product.sub_category?.[0]?.value || ''}"`,
            `"${product.brand?.name || ''}"`,
            `"${product.unit || ''}"`,
            `"${product.weight || ''}"`,
            `"${product.tags || ''}"`,
            `"${product.attribute?.map((attr: any) => attr.name).join('; ') || ''}"`,
            `"${product.attribute_value?.map((val: any) => val.value).join('; ') || ''}"`,
            `"${product.color?.name || ''}"`,
            product.todaysDeal ? 'Yes' : 'No',
            product.featured ? 'Yes' : 'No',
            product.cash_on_delivery ? 'Yes' : 'No',
            `"${product.quantity || ''}"`,
            `"${product.shipping_time || ''}"`,
            `"${product.tax || ''}"`,
            `"${(product.description || '').replace(/<[^>]*>/g, '').replace(/"/g, '""')}"`,
            `"${product.meta_title || ''}"`,
            `"${product.meta_desc || ''}"`,
            `"${product.country_pricing.map((country: any) => 
                `${country.country} (${country.currency_code}): ${country.unit_price}${country.discount ? ` - Discount: ${country.discount}` : ''}`
            ).join(' | ')}"`,
            `"${[
                product.gallery1,
                product.gallery2,
                product.gallery3,
                product.gallery4,
                product.gallery5
            ].filter(Boolean).join('; ')}"`,
        ])
    ]
        .map(row => row.map(cell => 
            cell === null || cell === undefined ? '""' : cell.toString()
        ).join(','))
        .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `GamesCorner_products_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};