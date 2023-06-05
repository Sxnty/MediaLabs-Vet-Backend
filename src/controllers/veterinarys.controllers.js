import { pool } from '../db.js';

export const addVeterinary = async (req, res) => {
  try {
    const emailRegex = /^\S+@\S+\.\S+$/;

    const { ownerCi, name, password, email, ownerName } = req.body;
    console.log(req.body);
    if (!ownerCi || !name || !password || !email || !ownerName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }
    if (typeof ownerCi !== 'number') {
      console.log('entramos');
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
    if (password.length > 16 || email.length > 50 || ownerName.length > 25) {
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
      'INSERT INTO veterinary (veterinary_owner_ci, veterinary_name, veterinary_password, veterinary_email, veterinary_owner_name) VALUES (?, ?, ?, ?, ?)',
      [ownerCi, name, password, email, ownerName]
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
