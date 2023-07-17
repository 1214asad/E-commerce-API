const notFoundMiddleWare = (req, res) => {
  res.status(400).json({ message: "Route Not found.." });
};

module.exports = notFoundMiddleWare;
