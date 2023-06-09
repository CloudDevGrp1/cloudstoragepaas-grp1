const db   = require('../database/models/');
const dotenv  = require('dotenv');
const aws   = require('aws-sdk');
dotenv.config();

const { File } = db;

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

class uploadController {

  //method to upload file and insert in the DB
  static async uploadMyFile(req, res){

    if (!req.file)
      return res.send('Please upload a file')

    try {
      const fileContent = fs.readFileSync(req.file.path);


      //Upload file to S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: fileContent
      };
      const result = await s3.upload(params).promise();
      //Insert file name and link in DB
      const file = await File.create({
        name: req.file.originalname,
        url: result.Location
      });

      // Return error of success msg
      return res.status(200).json({ message: 'File uploaded successfully' });

      
      } catch (error) {
        console.log('ERROR', error);
        return res.status('500').json({ errors: { error: 'Files not found', err: error.message } });
      }
  }

  //method to return files in the DB
  static async getFiles(req, res) {
    
     //Code to get all files from DB and return them
     try {
      //Code to get all files from DB and return them
      const files = await File.findAll();
      return res.status(200).json({ files });
    } catch (error) {
      console.log('ERROR', error);
      return res.status('500').json({ errors: { error: 'Error retrieving files', err: error.message } });
    }


   }
}

module.exports = uploadController;