const model = require('../../models/buscape');

const getProducts = async (data) => {
  const products = await model.getProducts(data);
  return products;
};

module.exports = {
  getProducts,
};
