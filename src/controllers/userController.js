const userModels = require('../config/userModels');


exports.getAllUsers = async (req, res) => {
    try {
        const allusers = await userModels.getAllUsers();
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data Pengguna', error: err.message });
    }
};

exports.deleteUserbyId = async (req, res) =>{

    const {id} = await req.params;

    if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID pengguna tidak valid.' });
    }

    try {
        const user = await userModels.deleteUser(id);
        res.status(200).json({message: 'Berhasil menghapus pengguna', user});
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data Pengguna', error: err.message });
    }
}

exports.findUserById = async (req, res) => {
    const {id} = await req.params;

    if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID pengguna tidak valid.' });
    }

    try {
        const user = await userModels.findUserById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data Pengguna', error: err.message });
    }
}

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { alamat, phone_number, tanggal_lahir } = req.body;

  try {
    const existingUser = await userModels.findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alamatBaru = alamat ?? existingUser.alamat;
    const phoneBaru = phone_number ?? existingUser.phone_number;
    const tanggalBaru = tanggal_lahir ?? existingUser.tanggal_lahir;

    await userModels.updateUserById(userId, alamatBaru, phoneBaru, tanggalBaru);

    res.json({ message: 'User updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};