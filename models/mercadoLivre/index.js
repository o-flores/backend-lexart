const axios = require('axios').default;
const { getConnection } = require('../connection');

const DB_COLLECTION = 'Lexartlabs';

async function fetchProductsByCategoryAndQuery(categoryId, query) {
  try {
    const { data } = await axios.get(`http://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
    return data.results;
  } catch (error) {
    return error;
  }
}

const formatInfo = async (productsList) => {
  const productsInfo = productsList.map(async (product) => {
    try {
      const { data } = await axios.get(`https://api.mercadolibre.com/products/${product.catalog_product_id}`);
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        link: product.permalink,
        description: data.short_description.content,
      };
    } catch (error) {
      return error;
    }
  });
  return Promise.all(productsInfo);
};

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

  try {
    const productsList = await verifiesIfSearchAlreadyExists(category, search, web);
    if (productsList) return productsList.results;

    const allproductsInfo = await fetchProductsByCategoryAndQuery(categoryId, search);
    const productsInfo = await formatInfo(allproductsInfo);
    const dbInfo = {
      category,
      search,
      web,
      results: productsInfo,
    };

    await db.collection(DB_COLLECTION).insertOne(dbInfo);
    return productsInfo;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getProducts,
};
