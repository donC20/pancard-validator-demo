const express = require('express');
const multer = require('multer');
const azureStorage = require('azure-storage');
const upload = multer({ storage: multer.memoryStorage() });
const cors = require('cors');
const app = express();

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
  const blobService = azureStorage.createBlobService("nearbynexusblob", "B4N3BiiEq6HNqMSPytSCErkiu/bKjaHebesnbdXcPqCW1IYxRPv4zAmL3r+AdAJqTZtTXBTiGM5p+ASt4J5nVA==");
  const blobName = Date.now() +"_"+ req.file.originalname;
  const stream = require('streamifier').createReadStream(req.file.buffer);
  const streamLength = req.file.buffer.length;

  blobService.createBlockBlobFromStream('nearbynexus-blobstore', blobName, stream, streamLength, err => {
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
