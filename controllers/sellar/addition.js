const { StatusCodes } = require("http-status-codes");
const Order = require("../../models/customerModel/CustomerOrder");

// get pending order for seller
const getPendingOrder = async (socket, sellar) => {
  try {
    const orders = await Order.find({
      sellarId: sellar.userId,
      orderStatus: "pending",
    })
      .populate({
        path: "orderedBy",
        select: "firstName surname _id",
      })
      .populate("items.food");

    if (orders.length > 0) {
      // Send the orders to the client through the socket
      socket.emit("pendingOrders", orders);
    } else {
      // Send an empty array to the client through the socket
      socket.emit("pendingOrders", []);
    }
  } catch (err) {
    // Send an error message to the client through the socket
    socket.emit("error", "Error getting orders");
  }
};
