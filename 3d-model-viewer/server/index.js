// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import { upload, uploadToGridFS } from "./Middleware/upload.js";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const MONGO_URI = "mongodb://127.0.0.1:27017/threeDModels";
// mongoose.connect(MONGO_URI)
//   .then(() => console.log(" Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// const PORT = 5000;


// app.post("/api/files/upload", upload.single("model"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const fileId = await uploadToGridFS(req.file);
//     res.json({ message: "File uploaded successfully ", fileId });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Upload failed " });
//   }
// });

// app.get("/", (req, res) => res.send("Server running 🚀"));

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { upload, uploadToGridFS } from "./Middleware/upload.js";
import { GridFSBucket } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017/threeDModels";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = 5000;

// Upload file
app.post("/api/files/upload", upload.single("model"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileId = await uploadToGridFS(req.file);
    res.json({ message: "File uploaded successfully ✅", fileId });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed ❌" });
  }
});

// Fetch all uploaded files
app.get("/api/files", async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find()
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Fetch specific file by filename
app.get("/api/files/:filename", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const filename = req.params.filename;

    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.on("error", () => res.status(404).json({ error: "File not found" }));
    res.set("Content-Type", "model/gltf-binary");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Error fetching file" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
