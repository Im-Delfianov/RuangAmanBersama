const userModels = require('../config/userModels');
const supabase = require('../config/supabaseClient');


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

    if (!id) {
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
  const { username, full_name, alamat, phone_number, tanggal_lahir } = req.body;

  try {
    const existingUser = await userModels.findUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const alamatBaru = alamat ?? existingUser.alamat;
    const phoneBaru = phone_number ?? existingUser.phone_number;
    const tanggalBaru = tanggal_lahir ?? existingUser.tanggal_lahir;
    const usernameBaru = username ?? existingUser.username;
    const full_nameBaru = full_name ?? existingUser.full_name;

    await userModels.updateUserById(userId, alamatBaru, phoneBaru, tanggalBaru, usernameBaru, full_nameBaru);

    res.json({ message: 'User updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePict = async (req, res) => {
     const userId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
    const existingUser = await userModels.findUserById(userId);
    const oldAvatarUrl = existingUser?.avatar_url;

    if (oldAvatarUrl && !oldAvatarUrl.includes('avatar-default.png')) {
      const oldFilePath = oldAvatarUrl.split('/storage/v1/object/public/images/')[1];
      await supabase.storage.from('images').remove([oldFilePath]);
    }

    const ext = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}-${timestamp}.${ext}`;
    const filePath = `avatar/${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res.status(500).json({ message: 'Upload ke Supabase gagal', detail: uploadError.message });
    }

    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const avatarUrl = publicData.publicUrl;

    await userModels.updatePictById(userId, avatarUrl);

    res.json({ message: 'Foto profil berhasil diupdate', avatar_url: avatarUrl });
  } catch (error) {
    console.error('Error update avatar:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  const user_id = req.params.id;
  const role = req.body;

  if(!user_id){return res.status(404).json({message: 'pengguna tidak ditemukan'})};

  try {
    await userModels.updateRole(role, user_id);

    res.json({message: 'Role telah diganti', user_id: user_id, role: role});
    
  } catch (error) {
    return res.status(500).json({message: 'gagal mengganti role'});
  }
}