const { getPool } = require('../config/database');

class User {
    static async findOne(criteria) {
        const pool = getPool();
        const keys = Object.keys(criteria);
        const values = Object.values(criteria);
        const where = keys.map(key => `${key} = ?`).join(' AND ');
        
        const [rows] = await pool.execute(
            `SELECT * FROM users WHERE ${where} LIMIT 1`,
            values
        );
        return rows[0] || null;
    }
    
    static async create(userData) {
        const pool = getPool();
        const { name, email, password, role } = userData;
        
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role || 'User']
        );
        
        return {
            id: result.insertId,
            name,
            email,
            role: role || 'User'
        };
    }
    
    static async find(criteria = {}, options = {}) {
        const pool = getPool();
        let query = 'SELECT id, name, email, role, created_at FROM users';
        
        if (Object.keys(criteria).length > 0) {
            const keys = Object.keys(criteria);
            const values = Object.values(criteria);
            const where = keys.map(key => `${key} = ?`).join(' AND ');
            query += ` WHERE ${where}`;
            const [rows] = await pool.execute(query, values);
            return rows;
        }
        
        const [rows] = await pool.execute(query);
        return rows;
    }
}

module.exports = User;