// CategoryPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from './ProductList';

const CategoryPage = ({ products, searchTerm, loading, error }) => {
    const { categoryName } = useParams();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const decodedCategoryName = decodeURIComponent(categoryName);
    
    // Создаем массив ключевых слов для каждой категории
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

    const categoryFilteredProducts = products.filter(product => {
        // Проверяем совпадение с любым из ключевых слов категории
        if (!product || !product.name) return false;
        
        const productNameLower = (product.name || '').toLowerCase();
        const productDescLower = (product.description || '').toLowerCase();
        const productCategoryLower = (product.category || '').toLowerCase();

        const matchesCategory = keywords.some(keyword => 
            productNameLower.includes(keyword) || 
            productCategoryLower.includes(keyword)
        );
        
        // Проверяем совпадение с поисковым запросом
        const matchesSearch = searchTermLower === '' || 
        productNameLower.includes(searchTermLower) ||
        productDescLower.includes(searchTermLower);

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="category-page">
            <h2>Категория: {decodedCategoryName}</h2>
            {categoryFilteredProducts.length > 0 ? (
                <ProductList products={categoryFilteredProducts} />
            ) : (
                <p>Нет товаров в данной категории.</p>
            )}
        </div>
    );
}

export default CategoryPage;