const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const pool = require('../config/database');
app.use(express.json());

exports.handleLogin = async (req, res) => {
    const {email, password } = req.body;
    
    if (!user || !password) return res.status(400).json({'message': 'Username dan Password tidak boleh kosong'});

    const foundUser = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    const user = foundUser.rows[0];

    if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Email tidak ditemukan' });
      }

    res.json({ message: 'Login berhasil', user: { id: user.id, email: user.email } });
}



exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User berhasil didaftarkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat register' });
  }
};

