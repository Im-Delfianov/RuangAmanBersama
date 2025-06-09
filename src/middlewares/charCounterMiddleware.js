exports.forumCharCounter = (req, res, next) =>{
const { title, content } = req.body;
 const titleCharCount = title.length;
  const contentCharCount = content.length;

  if (titleCharCount > 100) {
    return res.status(413).json({ message: 'Judul tidak boleh lebih dari 500 karakter' });
  }

  if (contentCharCount > 1500) {
    return res.status(413).json({ message: 'Isi tidak boleh lebih dari 1500 karakter' });
  }
  
  next();
 }

exports.commentCharCounter = (req, res, next) =>{
const {content } = req.body;
  const contentCharCount = content.length;

  if (contentCharCount > 1500) {
    return res.status(413).json({ message: 'Isi tidak boleh lebih dari 1500 karakter' });
  }
  
  next();
 }
