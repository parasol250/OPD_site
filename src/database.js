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

async function authenticateUser(username) {
    try {
        const result = await client.query(
            'SELECT id, username, role FROM users WHERE username = $1', 
            [username]
        );       
        console.log('Query result:', result.rows);
        return result.rows[0];
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
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
            'Cache-Control': 'public, max-age=86400'
        });
        res.end(data);
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (pathname.startsWith('/images/')) {
        const filePath = pathname.substring(1);
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
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
          } else if (pathname === '/api/filters' && req.method === 'GET') {
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
        }
        else if (pathname === '/api/auth' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                try {
                    const { username } = JSON.parse(body);
                    if (!username) {
                        throw new Error('Username parameter is required');
                    }     
                    const user = await authenticateUser(username);
                    
                    if (user) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            user: {
                                id: user.id,
                                username: user.username,
                                role: user.role
                            }
                        }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: 'User not found' 
                        }));
                    }
                } catch (err) {
                    console.error('Auth error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Server error' 
                    }));
                }
            });
        }

        else if ((pathname === '/api/check-username' || pathname === '/api/checkusername') && req.method === 'GET') {
            console.log('Check username endpoint accessed');
            console.log(`Received request: ${req.method} ${pathname}`);
            console.log('Check username endpoint hit');
            const username = parsedUrl.query.username;
            if (!username) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Username parameter is required' }));
                return;
            }

            try {
                const result = await client.query(
                'SELECT id FROM users WHERE username = $1', 
                [username]
                );
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exists: result.rows.length > 0 }));
            } catch (err) {
                console.error('Database error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database error' }));
            }
        }

        else if (pathname === '/api/register' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                try {
                    const { username, password_hash, role = 'user' } = JSON.parse(body);
                    
                    if (!username || !password_hash) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Username and password are required' }));
                        return;
                    }
        
                    const userExists = await client.query(
                        'SELECT id FROM users WHERE username = $1', 
                        [username]
                    );
                    if (userExists.rows.length > 0) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
        
                    const validRole = ['user', 'admin'].includes(role) ? role : 'user';
                    
                    const newUser = await client.query(
                        `INSERT INTO users (username, password_hash, role, created_at) 
                        VALUES ($1, $2, $3, NOW()) 
                        RETURNING id, username, role`,
                        [username, password_hash, validRole]
                    );
        
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true,
                        user: newUser.rows[0]
                    }));
                } catch (err) {
                    console.error('Registration error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false,
                        error: 'Registration failed',
                        details: err.message
                    }));
                }
            });
        }

        else if (pathname === '/api/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                try {
                    const { username, password_hash } = JSON.parse(body);
                    
                    if (!username || !password_hash) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Username and password are required' }));
                        return;
                    }

                    const user = await authenticateUser(username, password_hash);
                    if (user) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            user: {
                                id: user.id,
                                username: user.username,
                                role: user.role
                            }
                        }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
                    }
                } catch (err) {
                    console.error('Login error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Login failed' }));
                }
            });
        }

         else if (pathname === '/api/products' && req.method === 'GET') {
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
                        stock_quantity,
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
        } else if (pathname === '/api/users' && req.method === 'GET') {
        try {
            const result = await client.query('SELECT * FROM users');
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
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
    } else if (pathname.startsWith('/api/users/') && req.method === 'DELETE') {
        const userId = pathname.split('/')[3];
        
        try {
          const userCheck = await client.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
          );
          
          if (userCheck.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Пользователь не найден' }));
          }
      
          await client.query('DELETE FROM users WHERE id = $1', [userId]);
          
          res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          });          
          res.end(JSON.stringify({ success: true }));
        return;
        } catch (err) {
          console.error('Error deleting user:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Ошибка при удалении пользователя' }));
        }
      } else{
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    } catch (err) {
        console.error('Error handling request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error' }));
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
    console.log('Shutting down...');
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