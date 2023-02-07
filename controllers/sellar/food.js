const { StatusCodes } = require("http-status-codes");
const Food = require("../../models/sellarModel/Food");
const Menu = require("../../models/sellarModel/Menu");
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

//create menu
const createFood = async (req, res) => {
  const { foodName, price, nutritionalFacts, menuId, shortInfo } = req.body;
  const sellar = req.user.userId;

  if (!foodName || !price || !nutritionalFacts) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `all inputs should be filled` });
  }

  const menu = await Menu.findOne({ _id: menuId });

  if (!menu) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `menu with id ${menuId} is not recognized` });
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
    const food = await Food.create({
      foodImage: uri.secure_url,
      foodName: foodName,
      price: price,
      nutritionalFacts: nutritionalFacts,
      menu: menuId,
      storeOwner: sellar,
      shortInfo: shortInfo,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "food successfully added", food });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while adding food details" });
};

//edit food
const editFood = async (req, res) => {
  const sellar = req.user.userId;
  const { foodName, price, nutritionalFacts, foodId } = req.body;

  if (!foodId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Insert food Id` });
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
    const food = await Food.findByIdAndUpdate(
      { _id: foodId },
      {
        foodImage: uri.secure_url,
        foodName: foodName,
        price: price,
        nutritionalFacts: nutritionalFacts,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Food has been Successfully updated", food });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while updating food" });
};

//delete menu
const deleteFood = async (req, res) => {
  const { deleteId } = req.body;
  const sellar = req.user.userId;

  if (!deleteId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Invalid / No Id input` });
  }

  if (sellar) {
    const food = await Food.findByIdAndDelete({ _id: deleteId });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Food Successfully deleted" });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while deleting food" });
};

//get food
const getFood = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const food = await Food.find({ storeOwner: sellar });

    return res.status(StatusCodes.CREATED).json(food);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting food" });
};

module.exports = { createFood, editFood, deleteFood, getFood };
