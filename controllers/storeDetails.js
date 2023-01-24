const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const { Readable } = require("stream");
const sharp = require("sharp");
const StoreDetails = require("../models/StoreDetails");
require("../utils/cloudinary");

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
  const {
    storeName,
    location,
    cuisineType,
    openHours,
    deliveryFee,
    minimumOrder,
    description,
  } = req.body;
  const sellar = req.user.userId;
  if (!storeName || !cuisineType || !openHours) {
    return res.status(400).json({ msg: `all fields should be filled` });
  }

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
  // console.log(uri.secure_url);

  fs.unlinkSync(req.files.image.tempFilePath);

  if (sellar) {
    const storeDetails = await StoreDetails.create({
      storeName: storeName,
      cuisineType: cuisineType,
      location: location,
      openHours: openHours,
      deliveryFee: deliveryFee,
      rating: 0,
      minimumOrder: minimumOrder,
      description: description,
      serviceAvalaible: false,
      storeImage: uri.secure_url,
      storeOwner: sellar,
    });

    //storeName, cuisineType, openHours
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
  // console.log(uri.secure_url);

  fs.unlinkSync(req.files.image.tempFilePath);

  if (sellar) {
    const {
      storeName,
      cuisineType,
      location,
      openHours,
      deliveryFee,
      minimumOrder,
      description,
    } = req.body;
    const editedStore = await StoreDetails.findById(storeDetailsId);
    editedStore.storeName = storeName;
    editedStore.location = location;
    editedStore.cuisineType = cuisineType;
    editedStore.minimumOrder = minimumOrder;
    editedStore.deliveryFee = deliveryFee;
    editedStore.description = description;
    editedStore.serviceAvalaible = false;
    editedStore.openHours = openHours;
    editedStore.storeImage = uri.secure_url;

    const result = await editedStore.save();

    return res.status(StatusCodes.CREATED).json({
      msg: "Store has been created successfully",
      result,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating business information" });
};

//delete store details
const deleteStoreDetails = async (req, res) => {
  const { id: storeId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const store = await StoreDetails.findByIdAndRemove({
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
    const getStore = await StoreDetails.find({ storeOwner: sellar });
    return res.status(StatusCodes.OK).json(getStore);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error getting store details" });
};

module.exports = {
  createStoreDetails,
  editStoreDetails,
  deleteStoreDetails,
  getStoreDetails,
};
