const express = require('express');
const multer = require('multer');
const azureStorage = require('azure-storage');
const upload = multer({ storage: multer.memoryStorage() });
const cors = require('cors');
const app = express();

require('dotenv').config()

app.use(cors());

const azure_key = process.env.REACT_AZURE_KEY
const azure_acc_name = process.env.REACT_AZURE_ACC_NAME
const azure_container = process.env.REACT_AZURE_CONTAINER

app.post('/upload', upload.single('file'), (req, res) => {
  const blobService = azureStorage.createBlobService(azure_acc_name, azure_key);
  const blobName = Date.now() + "_" + req.file.originalname;
  const stream = require('streamifier').createReadStream(req.file.buffer);
  const streamLength = req.file.buffer.length;

  blobService.createBlockBlobFromStream(azure_container, blobName, stream, streamLength, err => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send({
        filename: blobName,
        originalname: req.file.originalname,
        size: streamLength,
        path: `https://nearbynexusblob.blob.core.windows.net/nearbynexus-blobstore/${blobName}`
      });
    }
  });
});

app.listen(4000, () => console.log('Server started on port 4000'));
