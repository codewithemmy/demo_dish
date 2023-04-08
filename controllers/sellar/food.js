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

//create food
const createFood = async (req, res) => {
  const { id: menuId } = req.params;
  const { foodName, price, nutritionalFacts, shortInfo } = req.body;
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
  const { foodName, price, nutritionalFacts, shortInfo } = req.body;

  const { id: foodId } = req.params;

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
        shortInfo: shortInfo,
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

//delete food
const deleteFood = async (req, res) => {
  const { id: deleteId } = req.params;
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
    const food = await Food.find({ storeOwner: sellar }).populate({
      path: "menu",
    });

    return res.status(StatusCodes.CREATED).json(food);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting food" });
};

//food availability
const foodAvailable = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const foodId = req.params.id;
    const food = await Food.findOne({
      _id: foodId,
    });
    if (!food) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `food id not available` });
    }
    food.foodavailable = !food.foodavailable;
    const result = await food.save();
    return res.status(StatusCodes.OK).json({ result });
  }

  return res
    .status(StatusCodes.OK)
    .json({ msg: `unable to verify the availability of food` });
};

module.exports = { createFood, editFood, deleteFood, getFood, foodAvailable };
