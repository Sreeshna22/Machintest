import multer from "multer";
import { MongoClient, GridFSBucket } from "mongodb";
import path from "path";
import { Readable } from "stream";

const mongoURI = "mongodb://127.0.0.1:27017";
const dbName = "threeDModels";

let bucket;
let db;


const connectToMongo = async () => {
  if (!db) {
    const client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: "uploads" });
    console.log("GridFS initialized");
  }
};


const storage = multer.memoryStorage();
const upload = multer({ storage });


const uploadToGridFS = async (file) => {
  await connectToMongo();

  const readableFile = new Readable();
  readableFile.push(file.buffer);
  readableFile.push(null);

  const uploadStream = bucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    readableFile.pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => {
        resolve(uploadStream.id);
      });
  });
};

export { upload, uploadToGridFS };
