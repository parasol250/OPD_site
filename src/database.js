require('dotenv').config();
const { Client } = require('pg');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT, 10),
});

async function connectToDatabase() {
    try {
        if (!client._connected && !client._connecting) {
            await client.connect();
            console.log('Connected to PostgreSQL database');
        }
    } catch (err) {
        console.error('Fatal database connection error:', err);
        process.exit(1);
    }
}

// Функция для добавления фильтра, если его еще нет
async function addFilterIfNotExists(name, displayName, value, productId) {
    const res = await client.query(
        'SELECT * FROM filters WHERE name=$1 AND value=$2 AND product_id=$3',
        [name, value, productId]
    );
    if (res.rows.length === 0) {
        await client.query(
            'INSERT INTO filters (name, display_name, value, product_id) VALUES ($1, $2, $3, $4)',
            [name, displayName, value, productId]
        );
    }
}



async function processProductFilters(productId, productData) {
    // productData — объект с данными о продукте, например:
    // { material: 'дерево', color: 'красный', size: 'средний', availability: 'в наличии', brand: 'Gucci', market: 'OZON' }

    const filterMappings = [
        { key: 'material', displayName: 'Материал' },
        { key: 'color', displayName: 'Цвет' },
        { key: 'size', displayName: 'Размер' },
        { key: 'availability', displayName: 'Наличие' },
        { key: 'brand', displayName: 'Бренд' },
        { key: 'market', displayName: 'Магазин' },
    ];

    for (const { key, displayName } of filterMappings) {
        if (productData[key]) {
            await addFilterIfNotExists(key, displayName, productData[key], productId);
        }
    }
}

function serveStaticFile(res, filePath, contentType) {
    const fullPath = path.join(__dirname, 'public', filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
            return;
        }

        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400' // Кэширование на 1 день
        });
        res.end(data);
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Обработка статических файлов
    if (pathname.startsWith('/images/')) {
        const filePath = pathname.substring(1); // Убираем первый слеш
        const extname = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif'
        };
        
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        serveStaticFile(res, filePath, contentType);
        return;
    }

    if (!client._connected) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database not connected' }));
        return;
    }

    try {
        if (pathname === '/api/filters' && req.method === 'GET') {
            const result = await client.query('SELECT DISTINCT ON (name) name, display_name FROM filters');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } else if (pathname === '/api/filters/add' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                const { name, displayName, value, productId } = JSON.parse(body);
                await addFilterIfNotExists(name, displayName, value, productId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        } else if (pathname === '/api/products' && req.method === 'GET') {
            try {
                const result = await client.query(`
                    SELECT 
                        id,
                        name,
                        description,
                        price,
                        original_url,
                        shop_id,
                        brand,
                        material,
                        color,
                        dimensions,
                        weight,
                        stock_quantity as "stockQuantity",
                        rating,
                        created_at,
                        updated_at,
                        -- Преобразуем массивы в JSON-совместимый формат
                        COALESCE(
                            CASE WHEN images IS NULL THEN '[]' 
                            ELSE array_to_json(images) END,
                            '[]'
                        )::json as images,
                        COALESCE(
                            CASE WHEN image_paths IS NULL THEN '[]' 
                            ELSE array_to_json(image_paths) END,
                            '[]'
                        )::json as "imagePaths"
                    FROM products
                `);
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                });
                res.end(JSON.stringify(result.rows));
            } catch (err) {
                console.error('Error fetching products:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database error', details: err.message }));
            }
        } else if (pathname === '/api/users' && req.method === 'GET') {
            const result = await client.query('SELECT * FROM users');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    } catch (err) {
        console.error('Error handling request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
    }
});

    // // Обработка запроса пользователей
    // if (pathname === '/api/users' && req.method === 'GET') {
    //     try {
    //         const result = await client.query('SELECT * FROM users');
    //         res.writeHead(200, { 
    //             'Content-Type': 'application/json',
    //             'Cache-Control': 'no-cache' // Отключаем кэширование для актуальных данных
    //         });
    //         res.end(JSON.stringify(result.rows));
    //     } catch (err) {
    //         console.error('Error fetching users:', err);
    //         res.writeHead(500, { 'Content-Type': 'application/json' });
    //         res.end(JSON.stringify({ 
    //             success: false,
    //             error: 'Database query error',
    //             details: err.message
    //         }));
    //     }
    // }
    // // Обработка запроса продуктов
    // else if (pathname === '/api/products' && req.method === 'GET') {
    //     try {
    //         const result = await client.query('SELECT * FROM products');
    //         res.writeHead(200, { 'Content-Type': 'application/json' });
    //         res.end(JSON.stringify(result.rows));
    //     } catch (err) {
    //         console.error('Error fetching products:', err);
    //         res.writeHead(500, { 'Content-Type': 'text/plain' });
    //         res.end('Server error');
    //     }
    // }
    // else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ 
    //         success: false,
    //         error: 'Endpoint not found'
    //     }));
    // }
// });

async function startServer() {
    try {
        await connectToDatabase();
        
        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
    console.log('Shutting down gracefully...');
    try {
        await client.end();
        server.close(() => {
            console.log('Server stopped');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
}

startServer();