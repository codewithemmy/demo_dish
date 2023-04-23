const Sellar = require("../../models/sellarModel/Sellar");
const fs = require("fs");
const { Readable } = require("stream");
const sharp = require("sharp");
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

//get Sellar profile
const getSellarProfile = async (req, res) => {
  const sellar = await Sellar.find({ _id: req.user.userId }).select({
    isVerified: 1,
    cuisineType: 1,
    wallet: 1,
    store: 1,
    firstName: 1,
    surname: 1,
    email: 1,
    phonenumber: 1,
  });

  res.status(200).json({ profile: sellar });
};

//udpdate profile
const updateSellarProfile = async (req, res) => {
  const sellarId = req.params.id;
  if (sellarId) {
    let converts = fs.readFileSync(req.files.image.tempFilePath, "base64");
    const buffer = Buffer.from(converts, "base64");

    const convert_url = async (req) => {
      const data = await sharp(buffer).webp({ quality: 20 }).toBuffer();
      //use clodinary as a promise using the uploadStream method
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Sellar Image Profile" },
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

    fs.unlinkSync(req.files.image.tempFilePath);

    await Sellar.findByIdAndUpdate(
      { _id: sellarId },
      { image: uri.secure_url, ...req.body },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json({ msg: `profile update successful`, image_url: uri.secure_url });
  }
  return res.status(400).json({ msg: `unable to update profile` });
};

module.exports = { getSellarProfile, updateSellarProfile };
