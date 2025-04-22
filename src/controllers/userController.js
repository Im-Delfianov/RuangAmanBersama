const pool = require('../config/database');

exports.getAllUsers = async (req, res) =>{
    try {
    const result = await pool.query('select * from public.users');
    res.json(result.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const handleNewUser = async (req, res) => {
    const {user, password} = req.body;
    if (!user || ! password) return res.status(400).json({ 'message' : 'username and password tidak boleh kosong'})
}
