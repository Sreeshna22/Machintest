import express from 'express';
import File from '../models/File.js'; 
import upload from '../Middleware/upload.js'; 

const router = express.Router();

router.post('/upload', upload.single('model'), async (req, res) => {
    try {
        const file = new File({
            filename: req.file.filename,
            contentType: req.file.contentType,
            fileUrl: `/files/${req.file.filename}`,
            uploadDate: new Date()
        });
        await file.save();
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ message: 'Error uploading file' });
    }
});


router.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (err) {
        console.error('Error fetching files:', err);
        res.status(500).json({ message: 'Error fetching files' });
    }
});


router.get('/files/:filename', async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.contentType(file.contentType);
        res.sendFile(file.fileUrl, { root: '.' });
    } catch (err) {
        console.error('Error fetching file:', err);
        res.status(500).json({ message: 'Error fetching file' });
    }
});

export default router;  