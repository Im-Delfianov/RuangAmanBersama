const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const userModel = require('../config/userModels')
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../utils/sendEmailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

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

    { expiresIn: '1h' }
  );

}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}



exports.googleRegister = async (req, res) => {
  const { id_token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  if (!id_token) return res.status(400).json({ message: 'ID Token is required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Cek apakah user sudah ada
    let user = await userModel.findUserbyEmail(email);

    if (user){return res.status(400).json({message: 'User telah terdaftar, silahkan login'})};


    if (!user) {
      // Generate username dari email jika belum dikirim dari frontend
      let username;
      let existingUser;
      do {
      username = `User${Math.floor(10000 + Math.random() * 90000)}`;
      existingUser = await userModel.findUserbyUsername(username); // Pastikan tidak dobel
      } while (existingUser);

      // Simpan user baru
      user = await userModel.createUser({
        email,
        password_hash: null, // karena pakai Google
        username,
        full_name: name,
        provider: 'google',
      });

      user = userModel.findUserbyEmail(user.email)
      await userModel.verifyUser(user.user_id);
    }


    

    res.status(200).json({ user });
  } catch (err) {
    console.error('Google register error:', err);
    res.status(500).json({ message: 'Failed to register with Google' });
  }
};



exports.registerUser = async (req, res) => {
  const {email, password, username, full_name} = req.body;
 
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
        provider: 'local'
      })

      const verificationToken = jwt.sign(
        { user_id: newUser.user_id },  
        process.env.EMAIL_VERIFICATION_SECRET,
        { expiresIn: '1d' } // token berlaku 1 hari
      );


      const verifyLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${verificationToken}`;

      await sendEmail({
        to: email,
        subject: 'Verifikasi Email',
        html: `
          <h3>Halo ${full_name},</h3>
          <p>Terima kasih telah mendaftar. Silakan klik link di bawah ini untuk verifikasi email kamu:</p>
          <a href="${verifyLink}" style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;">Verifikasi Email</a>
          <p>Jika kamu tidak mendaftar, abaikan email ini.</p>
        `
      });

      res.status(201).json({ message: 'Registrasi berhasil, Silakan cek email untuk verifikasi.' });
  }
  catch (error){
      console.error(error);
      res.status(500).json({ error: 'gagal membuat user' });
  }
  
};

exports.googleLogin = async (req, res) => {
  const { id_token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  if (!id_token) return res.status(400).json({ message: 'ID Token is required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    const user = await userModel.findUserbyEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    const accessToken= generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        message: 'Login berhasil',
        accessToken,
        user: {
          id: user.user_id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        }
      });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Login with Google failed' });
  }
};


exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
      const user = await userModel.findUserbyEmail(email)
      if (!user) {
        return res.status(401).json({ error: 'Email tidak ditemukan' });
      }

      if (!user.is_verified) {
        return res.status(403).json({ error: 'Akun belum diverifikasi. Cek email untuk verifikasi.' });
      }
      
      const {password_hash}= await userModel.userPass(email)
      const passIsMatch = await bcrypt.compare(password, password_hash);
      if (!passIsMatch) {
        return res.status(401).json({ error: 'Password salah' });
      }

      const accessToken= generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        message: 'Login berhasil',
        accessToken,
        user: {
          id: user.user_id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        }
      });
  
    }catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Terjadi kesalahan saat login', err });
    }
};


exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) =>{
    if (err) return res.sendStatus(403);

    const user = await userModel.findUserById(decoded.id);
    if (!user) return res.sendStatus(404);

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  });
}

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None' });
  res.json({ message: 'Logout berhasil' });
};


exports.verifyEmail = async (req, res) => {
  const token  = req.query.token;

 if (!token) return res.status(400).send('Token tidak ditemukan');

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    const { user_id } = decoded;

  
    await userModel.verifyUser(user_id);

    // Redirect ke halaman login frontend
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (err) {
    return res.status(400).send('Token tidak valid atau kadaluarsa');
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findUserbyEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'Email tidak ditemukan' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'Email sudah diverifikasi' });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.EMAIL_VERIFICATION_SECRET,
      { expiresIn: '1h' }
    );

    const verifyLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Verifikasi Ulang Email',
      html: `
        <h3>Halo ${user.full_name},</h3>
        <p>Berikut adalah tautan untuk verifikasi ulang email kamu:</p>
        <a href="${verifyLink}" style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;">Verifikasi Email</a>
        <p>Jika kamu tidak mendaftar, abaikan email ini.</p>
      `
    });

    res.status(200).json({ message: 'Email verifikasi telah dikirim ulang.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengirim ulang email verifikasi' });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findUserbyEmail(email);
    if (!user) return res.status(404).json({ error: 'Email tidak ditemukan' });

    const token = jwt.sign(
      { userId: user.user_id }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: '1h' }
    );

    const resetLink = `${process.env.BACKEND_URL}/auth/reset-password?token=${token}`;
    await userModel.saveResetToken(user.user_id, token, new Date(Date.now() + 3600000)); // 1 jam

    await sendEmail({
      to: email,
      subject: 'Reset Password',
      html: `<p>Klik link berikut untuk mengubah password:</p><a href="${resetLink}">Klik disini untuk mengganti password</a>`,
    });

    res.json({ message: 'Link reset password telah dikirim ke email Anda' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel.findUserByResetToken(token);
    if (!user) return res.status(400).json({ error: 'Token tidak valid atau sudah expired' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(user.user_id, hashed);

    res.json({ message: 'Password berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Token tidak valid atau expired' });
  }
};



