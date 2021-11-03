const service = require('../../services/buscape');

const getProducts = async (req, res) => {
  const { category, search, web } = req.body;
  const data = {
    category, web, search,
  };
  const response = await service.getProducts(data);

  if (response.message) return res.status(500).json({ error: { message: response.message } });
  return res.status(200).json(response);
};

module.exports = {
  getProducts,
};
