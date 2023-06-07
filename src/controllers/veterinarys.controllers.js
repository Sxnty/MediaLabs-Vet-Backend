import { pool } from '../db.js';

export const addVeterinary = async (req, res) => {
  try {
    const emailRegex = /^\S+@\S+\.\S+$/;

    const { ownerCi, name, password, email, ownerName, phoneNumber, status } = req.body;
    console.log(req.body);
    if (!ownerCi || !name || !password || !email || !ownerName || !phoneNumber || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }
    if (typeof ownerCi !== 'number' || typeof phoneNumber !=='number') {
      return res
        .status(400)
        .json({ error: 'Owner CI must be a valid integer number' });
    }
    if (
      typeof name !== 'string' ||
      typeof password !== 'string' ||
      typeof email !== 'string' ||
      typeof ownerName !== 'string'
    ) {
      return res.status(400).json({
        error: 'Name, password, email, and owner name must be strings',
      });
    }
    if (password.length > 16 || email.length > 50 || ownerName.length > 25 || phoneNumber.length > 15) {
      return res.status(400).json({
        error: 'Incorrect length of parameters',
      });
    }

    const [existingOwnerCi] = await pool.query(
      'SELECT veterinary_owner_ci FROM veterinary WHERE veterinary_owner_ci = ?',
      [ownerCi]
    );
    if (existingOwnerCi.length > 0) {
      return res.status(400).json({
        error: 'Veterinary with the same owner CI already exists',
      });
    }

    const [rows] = await pool.query(
      'INSERT INTO veterinary (veterinary_owner_ci, veterinary_name, veterinary_password, veterinary_email, veterinary_owner_name, veterinary_phone, veterinary_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ownerCi, name, password, email, ownerName, phoneNumber, status]
    );
    
    res.send({
      ownerCi,
      name,
      email,
      ownerName,
      inserId: rows.insertId,
    });
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while adding the veterinary to the database. Please contact a developer',
    });
  }
};
export const getVeterinaries = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM veterinary');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        'An error occurred while getting the veterinarys in the database. Please contact a developer',
    });
  }
};
export const getVeterinaryById = async (req, res) => {
  try {
    let { id } = req.params;
    id = Number(id);
    if (!id) {
      return res.status(400).json({ error: 'Veterinary ID is required' });
    }
    if (typeof id !== 'number') {
      return res
        .status(400)
        .json({ error: 'Veterinary ID need to be an integer number' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM veterinary WHERE veterinary_owner_ci = ?',
      [id]
    );
    if (rows.length <= 0) {
      res.status(404).json({ error: 'Veterinary not found.' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while getting the veterinary in the database. Please contact a developer',
    });
  }
};

export const getVeterinaryByphone = async (req, res) => {
  try {
    let { phone } = req.params;
    phone = Number(phone);
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (typeof phone !== 'number') {
      return res
        .status(400)
        .json({ error: 'Phone number need to be an integer number' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM veterinary WHERE veterinary_phone = ?',
      [phone]
    );
    if (rows.length <= 0) {
      res.status(404).json({ error: 'Veterinary not found.' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while getting the veterinary in the database. Please contact a developer',
    });
  }
};

export const getVeterinaryByEmail = async (req, res) => {
  try {
    let { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (typeof email !== 'string') {
      return res
        .status(400)
        .json({ error: 'Email need to be an string' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM veterinary WHERE veterinary_email = ?',
      [email]
    );
    if (rows.length <= 0) {
      res.status(404).json({ error: 'Veterinary not found.' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while getting the veterinary in the database. Please contact a developer',
    });
  }
};


export const deleteVeterinaryById = async (req, res) => {
  try {
    let { id } = req.params;
    id = Number(id);
    if (!id) {
      return res.status(400).json({ error: 'Veterinary ID is required' });
    }
    if (typeof id !== 'number') {
      return res
        .status(400)
        .json({ error: 'Veterinary ID need to be an integer number' });
    }

    const [result] = await pool.query(
      'DELETE FROM veterinary WHERE veterinary_owner_ci = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      // Si no se afectó ninguna fila, significa que no se encontró la veterinaria con el ID proporcionado
      return res.status(404).json({ error: 'Veterinary not found' });
    }

    res.json({ message: 'Veterinary deleted successfully' });
  } catch (error) {
    console.log(error);
  }
};
