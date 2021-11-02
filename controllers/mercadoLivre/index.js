const service = require('../../services/mercadoLivre');

const getProducts = async (req, res) => {
  const { id: categoryId } = req.params;
  const { category, search, web } = req.body;
  const data = {
    categoryId, category, web, search,
  };
  const response = await service.getProducts(data);

  if (response.message) return res.status(500).json({ error: { message: response.message } });
  return res.status(200).json(response);
};

module.exports = {
  getProducts,
};
