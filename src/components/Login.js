//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

async function check(username, password_hash, data){ 
    // 1. Find user in "database"
    const user = data.find((u) => u.username === username);
    if (!user) {
       
    }
    // 2. Compare hashed password
    const isPasswordValid = (password_hash === user.password_hash);
    if (!isPasswordValid) {
        
    }
    return (true);
}


async function checkCredentials(username, password_hash) {
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

module.exports=checkCredentials;