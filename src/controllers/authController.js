const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const userModel = require('../config/userModels')
const jwt = require('jsonwebtoken')

app.use(express.json());
app.use(bodyParser.json());






function generateAccessToken(user) {
  return jwt.sign(
    { 
      id: user.user_id, 
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,

    { expiresIn: '15m' }
  );

}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}







exports.registerUser = async (req, res) => {
  const {email, password, username, full_name, avatar_url} = req.body;
 
  try {


      const existingEmail = await userModel.findUserbyEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: 'Email sudah digunakan' });
      }  


       // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.createUser({
        email,
        password_hash: hashedPassword,
        username,
        full_name,
        avatar_url
      }
      )

      res.status(201).json({ message: 'Registrasi berhasil', newUser });
  }
  catch (error){
      console.error(error);
      res.status(500).json({ error: 'gagal membuat user' });
  }
  
};


exports.loginUser = async (req, res) => {
    const {email, password,} = req.body;

    try{
      const user = await userModel.findUserbyEmail(email)
      if (!user) {
        return res.status(401).json({ error: 'Email tidak ditemukan' });
      }

      const passIsMatch = await bcrypt.compare(password, user.password_hash);

      if (!passIsMatch) {
        return res.status(401).json({ error: 'Password salah' });
      }

      const accessToken= generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        accessToken,
        user: {
          id: user.user_id,
          email: user.email,
          role: user.role
        }
      });

      
      res.status(200).json({
        message: 'Login berhasil',
        user: {
          id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    }catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat login' });
    }
};

exports.refresh = (req, res) => {
  const token = req.cookie.refreshToken;
  if (!token) return res.sendstatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) =>{
    if (err) return res.sendstatus(403);

    const newAccessToken = jwt.sign(
      {id : user.user_id},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '15m'}
    );

    res.json({ accessToken: newAccessToken });
  });
}

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict' });
  res.json({ message: 'Logout berhasil' });
};







