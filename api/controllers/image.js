const imageDownloader = require("image-downloader");
const fs = require("fs");
const path = require("path");

const uploadWithLink = async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg'
    const newPath = path.join(__dirname, '..', 'uploads', newName);
    await imageDownloader.image({
        url: link,
        dest: newPath,
    });
    res.json(newName)
}

const uploadImageFile = (req, res) => {
    const uploadedFiles = [];
    for (const [key, value] of Object.entries(req.files)) {
        const { path: filePath, originalname } = value;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = filePath + '.' + ext;
        fs.renameSync(filePath, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(uploadedFiles)
}

module.exports = {
    uploadImageFile,
    uploadWithLink
}