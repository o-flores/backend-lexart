const axios = require('axios').default;
const { getConnection } = require('../connection');
const { verifiesIfSearchAlreadyExists } = require('../helper');

const DB_COLLECTION = 'Lexartlabs';

async function fetchProductsByCategoryAndQuery(categoryId, query) {
  try {
    const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
    return data.results;
  } catch (error) {
    return error;
  }
}

const formatInfo = async (productsList) => {
  const productsInfo = productsList.map(async (product) => {
    try {
      const { data } = await axios.get(`https://api.mercadolibre.com/products/${product.catalog_product_id}`);
      const description = data.short_description.content || '';
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        link: product.permalink,
        description,
      };
    } catch (error) {
      return error;
    }
  });
  return Promise.all(productsInfo);
};

const getProducts = async (data) => {
  const {
    category, search, web, categoryId,
  } = data;
  const db = await getConnection();

  const productsList = await verifiesIfSearchAlreadyExists(category, search, web);
  if (productsList) return productsList.results;

  const allproductsInfo = await fetchProductsByCategoryAndQuery(categoryId, search);
  if (allproductsInfo.message) return allproductsInfo;

  const productsInfo = await formatInfo(allproductsInfo);

  const dbInfo = {
    category,
    search,
    web,
    results: productsInfo,
  };

  await db.collection(DB_COLLECTION).insertOne(dbInfo);
  return productsInfo;
};

module.exports = {
  getProducts,
};
