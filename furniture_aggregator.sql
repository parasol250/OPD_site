CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    website VARCHAR(255) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_url VARCHAR(512),  -- Ссылка на товар в магазине
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    shop_id INT REFERENCES shops(id) ON DELETE SET NULL,
    brand VARCHAR(100),         -- Бренд мебели
    material VARCHAR(100),      -- Материал (дерево, металл и т.д.)
    color VARCHAR(50),
    dimensions VARCHAR(50),     -- Размеры (200x100x80)
    weight DECIMAL(10, 2),      -- Вес в кг
    stock_quantity INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',  -- user, admin, moderator
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE data_sources (
    id SERIAL PRIMARY KEY,
    shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
    last_successful_scrape TIMESTAMP,  -- Дата последнего успешного парсинга
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scrape_logs (
    id SERIAL PRIMARY KEY,
    source_id INT REFERENCES data_sources(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL,       -- success, failed, partial
    new_items INT DEFAULT 0,           -- Количество новых товаров
    updated_items INT DEFAULT 0       -- Количество обновленных товаров
);
