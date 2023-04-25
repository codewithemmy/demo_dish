const Customer = require("../../models/customerModel/Customer");
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
  const customerId = req.params.id;
  const profile = await Customer.find(
    { _id: customerId },
    { verificationToken: 0, password: 0, location: 0, orders: 0, __v: 0 }
  );
  return res.status(200).json(profile);
};

//udpdate profile
const updateProfile = async (req, res) => {
  const customerId = req.params.id;
  if (customerId) {
    if (req.files) {
      let converts = fs.readFileSync(req.files.image.tempFilePath, "base64");
      const buffer = Buffer.from(converts, "base64");

      const convert_url = async (req) => {
        const data = await sharp(buffer).webp({ quality: 20 }).toBuffer();
        //use clodinary as a promise using the uploadStream method
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "CustomerProfile" },
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

      await Customer.findByIdAndUpdate(
        { _id: customerId },
        { image: uri.secure_url, ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ msg: `profile update successful` });
    }

    await Customer.findByIdAndUpdate(
      { _id: customerId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ msg: `profile update successful` });
  }
  return res.status(400).json({ msg: `unable to update profile` });
};

module.exports = {
  getProfile,
  updateProfile,
};
