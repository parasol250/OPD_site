import CryptoJS from 'crypto-js';

async function check(username, password_hash, data){ 
    // 1. Find user in "database"
    const user = data.find((u) => u.username === username);
    if (!user) {
       console.log('User not found');
       return false;
    }
    // 2. Compare hashed password
    const isPasswordValid = (password_hash === user.password_hash);
    if (!isPasswordValid) {
        console.log('Invalid password');
        return false;
    }
    return (true);
}


export async function checkCredentials(username, password_hash) {
    try {
        const response = await fetch('http://localhost:5000/api/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users:', data);
        return check(username, password_hash, data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
}


export function hashString(str) {
  return CryptoJS.SHA256(str).toString();
}

export async function checkUsernameExists(username) {
  try {
    const response = await fetch(`http://localhost:5000/api/checkusername?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()).exists;
  } catch (err) {
    console.error('Error checking username:', err);
    throw err;
  }
}

// api/auth.js
export async function registerUser(username, passwordHash, role = 'user') {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        password_hash: passwordHash,
        role 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Ошибка регистрации');
    }

    return await response.json();
  } catch (err) {
    console.error('Registration API error:', err);
    throw err;
  }
}
