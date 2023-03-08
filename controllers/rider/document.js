// const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const { Readable } = require("stream");
const sharp = require("sharp");
const Document = require("../../models/riderModel/Document");
require("../../utils/cloudinary");

//require cloudinary version 2
const cloudinary = require("cloudinary").v2;

// create a function that invokes buffer reading for sharp stream packages
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

const multipleDoc = async (req, res) => {
  const photos = req.files.image;
  const email = req.user.email.toString();

  // Iterate through the array and upload each file to Cloudinary
  photos.forEach((photo) => {
    cloudinary.uploader.upload(
      photo.tempFilePath,
      {
        use_filename: true,
        folder: email,
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error uploading to Cloudinary");
        }
      }
    );
  });
  return res.status(200).json({ msg: `file upload successful` });
};

//insert uploaded pictures/photos
const insertDoc = async (req, res) => {
  // const user = req.user;
  // if (user) {
    const { type } = req.body;
    //create function that uses async/await while return promise with cloudinary & sharp package
    const convert_url = async (req) => {
      const data = await sharp(req.files.image.tempFilePath)
        .webp({ quality: 20 })
        .toBuffer();
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "DEV" },
          (err, url) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          }
        );
        bufferToStream(data).pipe(stream);
      });
    };

    const uri = await convert_url(req);

    //find and update item with cloudinary secure url
    const document = await Document.create({
      document: uri.secure_url,
      type,
    });

    return res.status(200).json(document);
  

  // return res.status(400).json({ msg: `unable to upload document` });
};

module.exports = { multipleDoc, insertDoc };