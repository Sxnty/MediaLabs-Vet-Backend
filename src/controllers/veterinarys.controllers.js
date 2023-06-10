import { pool } from '../db.js';
import bcrypt from 'bcrypt';

/* export const addVeterinary = async (req, res) => {
  try {
    const emailRegex = /^\S+@\S+\.\S+$/;

    const { ownerCi, name, password, email, ownerName, phoneNumber, status } =
      req.body;
    if (
      !ownerCi ||
      !name ||
      !password ||
      !email ||
      !ownerName ||
      !phoneNumber ||
      !status
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }
    if (typeof ownerCi !== 'number' || typeof phoneNumber !== 'number') {
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
    if (
      password.length > 16 ||
      email.length > 50 ||
      ownerName.length > 25 ||
      phoneNumber.length > 15
    ) {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await pool.query(
      'INSERT INTO veterinary (veterinary_owner_ci, veterinary_name, veterinary_password, veterinary_email, veterinary_owner_name, veterinary_phone, veterinary_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ownerCi, name, hashedPassword, email, ownerName, phoneNumber, status]
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
}; */

import Veterinary from '../models/veterinary.model.js';

export const addVeterinary = async (req, res) => {
  try {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const { ownerCi, name, password, email, ownerName, phoneNumber, status } = req.body;
    if (
      !ownerCi ||
      !name ||
      !password ||
      !email ||
      !ownerName ||
      !phoneNumber ||
      !status
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }
    if (typeof ownerCi !== 'number' || typeof phoneNumber !== 'number') {
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
    if (
      password.length > 16 ||
      email.length > 50 ||
      ownerName.length > 25 ||
      phoneNumber.length > 15
    ) {
      return res.status(400).json({
        error: 'Incorrect length of parameters',
      });
    }
    const existingOwnerCi = await Veterinary.existsByOwnerCi(ownerCi);
    if (existingOwnerCi) {
      return res.status(400).json({ error: 'Veterinary with the same owner CI already exists' });
    }



    const insertId = await Veterinary.create(ownerCi, name, password, email, ownerName, phoneNumber, status);

    res.send({
      ownerCi,
      name,
      email,
      ownerName,
      insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the veterinary to the database. Please contact a developer' });
  }
};



export const getVeterinaries = async (req, res) => {
  try {
    const veterinaries = await Veterinary.getAll();
    res.json(veterinaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        'An error occurred while getting the veterinaries in the database. Please contact a developer',
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
        .json({ error: 'Veterinary ID needs to be an integer number' });
    }
    const veterinary = await Veterinary.getById(id);
    if (!veterinary) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }
    res.json(veterinary);
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while getting the veterinary in the database. Please contact a developer',
    });
  }
};

export const getVeterinaryByPhone = async (req, res) => {
  try {
    let { phone } = req.params;
    phone = Number(phone);
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (typeof phone !== 'number') {
      return res
        .status(400)
        .json({ error: 'Phone number needs to be an integer number' });
    }
    const veterinary = await Veterinary.getByPhone(phone);
    if (!veterinary) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }
    res.json(veterinary);
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while getting the veterinary from the database. Please contact a developer',
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
      return res.status(400).json({ error: 'Email needs to be a string' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const veterinary = await Veterinary.getByEmail(email);
    if (!veterinary) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }
    res.json(veterinary);
  } catch (error) {
    res.status(500).json({
      error:
        'An error occurred while getting the veterinary from the database. Please contact a developer',
    });
  }
};

export const deleteVeterinaryById = async (req, res) => {
  try {
    let { id } = req.params;
    id = Number(id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Veterinary ID is required and must be a number' });
    }

    const result = await Veterinary.deleteById(id);

    if (!result) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }

    res.json({ message: 'Veterinary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the veterinary' });
  }
};


export const updateVeterinaryName = async (req, res) => {
  try {
    let { id } = req.params;
    let { newName } = req.body;
    id = Number(id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Veterinary ID is required and must be a number' });
    }

    if (!newName || typeof newName !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing new name' });
    }

    const result = await Veterinary.updateName(id, newName);

    if (result === 0) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }

    return res.json({ message: 'Veterinary name successfully updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the veterinary name' });
  }
};

export const updateVeterinaryEmail = async (req, res) => {
  try {
    let { id } = req.params;
    let { newEmail } = req.body;
    id = Number(id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Veterinary ID is required and must be a number' });
    }

    if (!newEmail || typeof newEmail !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing new email' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = await Veterinary.updateEmail(id, newEmail);

    if (result === 0) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }

    return res.json({ message: 'Veterinary email successfully updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the veterinary email' });
  }
};
export const updateVeterinaryStatus = async (req, res) => {
  try {
    let { id } = req.params;
    let { status } = req.body;
    id = Number(id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Veterinary ID is required and must be a number' });
    }

    if (typeof status === 'undefined' || status === null) {
      return res.status(400).json({ error: 'Invalid or missing new status' });
    }

    if (typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Veterinary status needs to be a boolean' });
    }

    const result = await Veterinary.updateStatus(id, status);

    if (result === 0) {
      return res.status(404).json({ error: 'Veterinary not found' });
    }

    return res.json({ message: 'Veterinary status successfully updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the veterinary status' });
  }
};
