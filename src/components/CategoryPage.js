//import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from './ProductList';

const CategoryPage = ({ products, searchTerm, loading, error, currentUser, favorites, toggleFavorite, filters }) => {
    const { categoryName } = useParams();

    if (loading) {return <div>Loading...</div>;}
    if (error) {return <div>Error: {error.message}</div>;}

    const decodedCategoryName = decodeURIComponent(categoryName);

    const getKeywordsForCategory = (category) => {
        const keywordsMap = {
            'Диваны и кресла': ['диван', 'кресло', 'софа', 'канапе'],
            'Шкафы и стеллажи': ['шкаф', 'стеллаж', 'гардероб', 'полка'],
            'Кровати и матрасы': ['кровать', 'матрас', 'спальня', 'изголовье'],
            'Тумбы и комоды': ['тумба', 'комод', 'прикроватная', 'туалетная'],
            'Столы и стулья': ['стол', 'стул', 'табурет', 'обеденный'],
            'Детская мебель': ['детск', 'ребенок', 'кроватка', 'игровой']
        };     
        return keywordsMap[category] || [category?.toLowerCase()];
    };

    const keywords = getKeywordsForCategory(decodedCategoryName);
    const searchTermLower = searchTerm.toLowerCase();

    const applyFilters = (products) => {
        let result = [...products];
        
        if (filters.price !== null) {
            result = result.filter(p => {
                const productPrice = p.price || 0;
                return productPrice <= filters.price;
            });
        }
        if (filters.material) {
            result = result.filter(p => p.material === filters.material);
        }
        if (filters.color) {
            result = result.filter(p => p.color === filters.color);
        }
        if (filters.dimensions) {
            result = result.filter(p => p.dimensions === filters.dimensions);
        }
        if (filters.availability !== null) {
            result = result.filter(p => p.availability === filters.availability);
        }
        if (filters.brand) {
            result = result.filter(p => p.brand === filters.brand);
        }
        if (filters.shop_id) {
            result = result.filter(p => p.shop_id === filters.shop_id);
        }
        
        return result;
    };

    const categoryFilteredProducts = products.filter(product => {
        if (!product || !product.name) return false;
        
        const productNameLower = (product.name || '').toLowerCase();
        const productDescLower = (product.description || '').toLowerCase();
        const productCategoryLower = (product.category || '').toLowerCase();

        const matchesCategory = keywords.some(keyword => 
            productNameLower.includes(keyword) || 
            productCategoryLower.includes(keyword)
        );
        const matchesSearch = searchTermLower === '' || 
        productNameLower.includes(searchTermLower) ||
        productDescLower.includes(searchTermLower);

        return matchesCategory && matchesSearch;
    });

    const fullyFilteredProducts = applyFilters(categoryFilteredProducts);

    return (
        <div className="category-page">
            <h2>Категория: {decodedCategoryName}</h2>
            {categoryFilteredProducts.length > 0 ? (
                <ProductList
                    products={fullyFilteredProducts}
                    currentUser={currentUser}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />
            ) : (
                <p>Нет товаров в данной категории.</p>
            )}
        </div>
    );
}

export default CategoryPage;