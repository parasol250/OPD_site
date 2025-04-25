drop table categories cascade;
drop table data_sources cascade;
drop table scrape_logs cascade;
drop table shops cascade;
drop table products cascade;
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Создание таблицы товаров (products)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    original_url VARCHAR(512),
    shop_id INT,
    brand VARCHAR(100),
    material VARCHAR(100),
    color VARCHAR(50),
    dimension VARCHAR(50),
    weight DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    site VARCHAR(512) NOT NULL UNIQUE,
    shop_name VARCHAR(100) NOT NULL,  -- Add shop_name column
    product_link_selector VARCHAR(512),
    name_selector VARCHAR(512),
    description_selector VARCHAR(512),
    price_selector VARCHAR(512),
    brand_selector VARCHAR(512),
    material_selector VARCHAR(512),
    color_selector VARCHAR(512),
    dimension_selector VARCHAR(512),
    weight_selector VARCHAR(512),
    stock_quantity_selector VARCHAR(512),
    rating_selector VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE  -- Add an "is_active" column
);
