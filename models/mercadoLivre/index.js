const axios = require('axios').default;
const { getConnection } = require('../connection');

const DB_COLLECTION = 'Lexartlabs';

async function fetchProductsByCategoryAndQuery(categoryId, query) {
  try {
    const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
    return data.results;
  } catch (error) {
    return error;
  }
}

const verifiesIfSearchAlreadyExists = async (category, query, webSite) => {
  const db = await getConnection();
  const product = await db.collection(DB_COLLECTION).findOne({
    $and: [
      { category: { $eq: category } },
      { search: { $eq: query } },
      { web: { $eq: webSite } },
    ],
  });
  return product;
};

const getProducts = async (data) => {
  const {
    category, search, web, categoryId,
  } = data;
  const db = await getConnection();

  const productsList = await verifiesIfSearchAlreadyExists(category, search, web);
  if (productsList) return productsList.results;

  const AllproductsInfo = await fetchProductsByCategoryAndQuery(categoryId, search);
  const productsInfo = AllproductsInfo.map((product) => ({
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    link: product.permalink,
  }));

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
