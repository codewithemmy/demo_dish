const { StatusCodes } = require("http-status-codes");
const Menu = require("../../models/sellarModel/Menu");
const Food = require("../../models/sellarModel/Food");

//create menu
const createMenu = async (req, res) => {
  const { menuTitle, description } = req.body;

  const { id: storeId } = req.params;

  const sellar = req.user.userId;

  if (!menuTitle) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `kindly input your menu title` });
  }

  if (sellar) {
    const menu = await Menu.create({
      menuTitle: menuTitle,
      description: description,
      storeOwner: sellar,
      store: storeId,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully created", menu });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while creating menu" });
};

//edit menu
const editMenu = async (req, res) => {
  const sellar = req.user.userId;
  const { menuTitle, description, menuId } = req.body;

  if (!menuId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Invalid/No Id input` });
  }

  if (sellar) {
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

    const menu = await Menu.findByIdAndUpdate(
      menuId,
      {
        menuTitle: menuTitle,
        description: description,
        menuImage: uri.secure_url,
      },
      { runValidators: true, new: true }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully updated", menu });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while updating menu" });
};

//delete menu
const deleteMenu = async (req, res) => {
  const { deleteId } = req.body;
  const sellar = req.user.userId;

  if (!deleteId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Invalid/No Id input` });
  }

  if (sellar) {
    await Menu.findByIdAndDelete({ _id: deleteId });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully deleted" });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while deleting menu" });
};

//get menu
const getMenu = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const menu = await Menu.find({ storeOwner: sellar });

    return res.status(StatusCodes.CREATED).json(menu);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting menu" });
};

//get menu
const getSingleMenu = async (req, res) => {
  const sellar = req.user.userId;
  const { id: menuId } = req.params;
  if (sellar) {
    const menu = await Menu.find({ storeOwner: sellar, _id: menuId });

    return res.status(StatusCodes.CREATED).json(menu);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting menu" });
};

//get menu with food
const getMenuFood = async (req, res) => {
  const { menuId } = req.body;
  const sellar = req.user.userId;
  if (sellar) {
    const food = await Food.find({ menu: menuId, storeOwner: sellar });
    if (!food) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `cannot find id: ${menuId} in params` });
    }

    return res.status(StatusCodes.OK).json(food);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting menu with food" });
};

module.exports = {
  createMenu,
  editMenu,
  deleteMenu,
  getMenu,
  getSingleMenu,
  getMenuFood,
};
