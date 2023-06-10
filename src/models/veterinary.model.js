import { pool } from '../db.js';
import bcrypt from 'bcrypt';

const Veterinary = {
  async create(ownerCi, name, password, email, ownerName, phoneNumber, status) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await pool.query(
      'INSERT INTO veterinary (veterinary_owner_ci, veterinary_name, veterinary_password, veterinary_email, veterinary_owner_name, veterinary_phone, veterinary_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ownerCi, name, hashedPassword, email, ownerName, phoneNumber, status]
    );
    return rows.insertId;
  },

  async existsByOwnerCi(ownerCi) {
    const [existingOwnerCi] = await pool.query(
      'SELECT veterinary_owner_ci FROM veterinary WHERE veterinary_owner_ci = ?',
      [ownerCi]
    );
    return existingOwnerCi.length > 0;
  },

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM veterinary');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM veterinary WHERE veterinary_owner_ci = ?',
      [id]
    );
    return rows[0];
  },

  async getByPhone(phone) {
    const [rows] = await pool.query(
      'SELECT * FROM veterinary WHERE veterinary_phone = ?',
      [phone]
    );
    return rows[0];
  },
  async getByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM veterinary WHERE veterinary_email = ?',
      [email]
    );
    return rows[0];
  },

  async deleteById(id) {
    id = Number(id);
    if (!id) {
      throw new Error('Veterinary ID is required');
    }
    if (typeof id !== 'number' || !Number.isInteger(id)) {
      throw new Error('Veterinary ID needs to be an integer number');
    }

    const [result] = await pool.query(
      'DELETE FROM veterinary WHERE veterinary_owner_ci = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return false
    }

    return true;
  },
  async updateName(id, newName) {
    const [result] = await pool.query(
      'UPDATE veterinary SET veterinary_name = ? WHERE veterinary_owner_ci = ?',
      [newName, id]
    );
    return result.affectedRows;
  },

  async updateEmail(id, newEmail) {
    const [result] = await pool.query(
      'UPDATE veterinary SET veterinary_email = ? WHERE veterinary_owner_ci = ?',
      [newEmail, id]
    );
    return result.affectedRows;
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE veterinary SET veterinary_status = ? WHERE veterinary_owner_ci = ?',
      [status, id]
    );
    return result.affectedRows;
  }
};

export default Veterinary;
