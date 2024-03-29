const StoreDetails = require("../../models/sellarModel/StoreDetails");
const { StatusCodes } = require("http-status-codes");
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

//create store details
const createStoreDetails = async (req, res) => {
  const { storeName, cuisineType } = req.body;

  const sellar = req.user.userId;
  if (!storeName || !cuisineType) {
    return res
      .status(400)
      .json({ msg: `storeName field & cuisine type field should be filled` });
  }

  if (sellar) {
    const storeDetails = await StoreDetails.create({
      ...req.body,
      rating: 0,
      storeOwner: sellar,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "store details created successfully", storeDetails });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating store details" });
};

//edit store details
const editStoreDetails = async (req, res) => {
  const { id: storeDetailsId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    if (req.files) {
      let converts = fs.readFileSync(req.files.image.tempFilePath, "base64");
      const buffer = Buffer.from(converts, "base64");

      const convert_url = async (req) => {
        const data = await sharp(buffer).webp({ quality: 20 }).toBuffer();
        //use clodinary as a promise using the uploadStream method
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "SellarStore" },
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
      // console.log(uri.secure_url);

      fs.unlinkSync(req.files.image.tempFilePath);

      const editStoreDetails = await StoreDetails.findByIdAndUpdate(
        {
          _id: storeDetailsId,
        },
        { ...req.body, storeImage: uri.secure_url },
        { new: true, runValidators: true }
      );

      return res.status(StatusCodes.CREATED).json({
        msg: "Store has been updated successfully",
        editStoreDetails,
      });
    }
    const editStoreDetails = await StoreDetails.findByIdAndUpdate(
      {
        _id: storeDetailsId,
      },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Store has been updated successfully",
      editStoreDetails,
    });
  }
  return res.status(StatusCodes.BAD_REQUEST).json({ msg: "unable to update" });
};

//delete store details
const deleteStoreDetails = async (req, res) => {
  const { id: storeId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    await StoreDetails.findByIdAndRemove({
      _id: storeId,
    });

    return res.status(StatusCodes.CREATED).json({
      msg: "Store has been deleted",
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in deleting store" });
};

const getStoreDetails = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const getStore = await StoreDetails.find({ storeOwner: sellar })
      .sort({ createdAt: "desc" })
      .exec();
    return res.status(StatusCodes.OK).json(getStore);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error getting store details" });
};

const isAvailable = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const verifySellar = await StoreDetails.findOne({
      storeOwner: sellar,
      _id: req.params.id,
    });

    if (!verifySellar) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `not a verified sellar` });
    }

    verifySellar.serviceAvalaible = !verifySellar.serviceAvalaible;
    const result = await verifySellar.save();

    return res.status(200).json({ msg: `Sellar is now available` });
  }

  return res
    .status(StatusCodes.OK)
    .json({ msg: `unable to verify the availability of sellar` });
};

const getStoreLocation = async (req, res) => {
  const { lng, lat } = req.body;
  const storeId = req.params.id;
  if (storeId) {
    const location = await StoreDetails.findByIdAndUpdate(
      { _id: storeId },
      {
        location: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ msg: `longitude and latitude created successful`, location });
  }

  return res
    .status(400)
    .json({ msg: `unable to store longitude and latitude` });
};

module.exports = {
  createStoreDetails,
  editStoreDetails,
  deleteStoreDetails,
  getStoreDetails,
  isAvailable,
  getStoreLocation,
};
