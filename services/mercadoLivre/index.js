const model = require('../../models/mercadoLivre');

const getProducts = async (data) => {
  const products = await model.getProducts(data);
  return products;
};

module.exports = {
  getProducts,
};
