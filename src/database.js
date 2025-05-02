require('dotenv').config();
const { Client } = require('pg');
const http = require('http');
const url = require('url');

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

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (!client._connected) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database not connected' }));
        return;
    }

    // Обработка запроса пользователей
    if (pathname === '/api/users' && req.method === 'GET') {
        try {
            const result = await client.query('SELECT * FROM users');
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache' // Отключаем кэширование для актуальных данных
            });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error('Error fetching users:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false,
                error: 'Database query error',
                details: err.message
            }));
        }
    }
    // Обработка запроса продуктов
    else if (pathname === '/api/products' && req.method === 'GET') {
        try {
            const result = await client.query('SELECT * FROM products');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            console.error('Error fetching products:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server error');
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: false,
            error: 'Endpoint not found'
        }));
    }
});

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