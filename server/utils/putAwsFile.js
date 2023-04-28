const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const fs = require('fs');
const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: 'AKIARNN77MLZHOGO7FG5',
    secretAccessKey: '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',
  },
});
const putFile = async (path, name) => {
  const fileContent = fs.readFileSync(path);
  const fileName = name;
  const params = {
    Bucket: 'myawsubket',
    Key: fileName,
    Body: fileContent,
  };
  try {
    const uploadCommand = new PutObjectCommand(params);
    const result = await s3Client.send(uploadCommand);
    const command = new GetObjectCommand({
      Bucket: 'myawsubket',
      Key: fileName,
    });
    const url = `https://myawsubket.s3.us-east-2.amazonaws.com/${fileName}`;
    return url;
  } catch (err) {
    console.log(err);
  }
};
module.exports = putFile;
