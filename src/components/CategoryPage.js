// CategoryPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard'; // Import ProductCard

function CategoryPage({ products }) {
    const { categoryName } = useParams();

    const filteredProducts = products.filter(product =>
        product.category.toLowerCase() === categoryName.toLowerCase()
    );

    return (
        <div>
            <h2>{categoryName}</h2>
            {filteredProducts.length > 0 ? (
                <div className="product-list"> {/* Add a container for the ProductCard components */}
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />  // Use ProductCard
                    ))}
                </div>
            ) : (
                <p>Нет товаров в этой категории.</p>
            )}
        </div>
    );
}

export default CategoryPage;