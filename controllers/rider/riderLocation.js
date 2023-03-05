const Rider = require("../../models/riderModel/Rider");

//create location
const getRiderLocation = async (req, res) => {
  const { lng, lat } = req.body;
  const riderId = req.params.id;
  if (riderId) {
    const rider = await Rider.findByIdAndUpdate(
      { _id: riderId },
      { lng, lat },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ msg: `longitude and latitude created successful`, rider });
  }

  return res
    .status(400)
    .json({ msg: `unable to store longitude and latitude` });
};

module.exports = {
  getRiderLocation,
};
