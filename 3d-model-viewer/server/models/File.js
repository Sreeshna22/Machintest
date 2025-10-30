
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

export default File;  // Export as default
