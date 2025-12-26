const pool = require('../config/db');

class RoleRepository {
    async findByName(roleName) {
        const query = 'SELECT * FROM roles WHERE role_name = $1';
        const result = await pool.query(query, [roleName]);
        return result.rows[0];
    }

    async findById(id) {
        const query = 'SELECT * FROM roles WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = new RoleRepository();
