const Rider = require("../../models/riderModel/Rider");
const Support = require("../../models/riderModel/Support");
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

//get profile
const getProfile = async (req, res) => {
  const riderId = req.params.id;
  if (riderId) {
    const profile = await Rider.find({ _id: riderId }).select(
      "-verificationToken -password"
    );
    return res.status(200).json(profile);
  }
};

//udpdate profile
const updateProfile = async (req, res) => {
  const riderId = req.params.id;
  if (riderId) {
    if (req.files) {
      let converts = fs.readFileSync(req.files.image.tempFilePath, "base64");
      const buffer = Buffer.from(converts, "base64");

      const convert_url = async (req) => {
        const data = await sharp(buffer).webp({ quality: 20 }).toBuffer();
        //use clodinary as a promise using the uploadStream method
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

      fs.unlinkSync(req.files.image.tempFilePath);

      await Rider.findByIdAndUpdate(
        { _id: riderId },
        { image: uri.secure_url, ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ msg: `profile update successful` });
    }
    await Rider.findByIdAndUpdate(
      { _id: riderId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ msg: `profile update successful` });
  }
  return res.status(400).json({ msg: `unable to update profile` });
};

const createSupport = async (req, res) => {
  const rider = req.user;

  if (rider) {
    let converts = fs.readFileSync(req.files.image.tempFilePath, "base64");
    const buffer = Buffer.from(converts, "base64");

    const convert_url = async (req) => {
      const data = await sharp(buffer).webp({ quality: 20 }).toBuffer();
      //use clodinary as a promise using the uploadStream method
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "SUPPORT" },
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

    await Support.create({
      ...req.body,
      image: uri.secure_url,
      email: req.user.email,
    });

    return res.status(200).json({ ms: `Successful` });
  }
  return res.status(400).json({ ms: `unable to submit support` });
};

module.exports = {
  getProfile,
  updateProfile,
  createSupport,
};
