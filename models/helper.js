const { getConnection } = require('./connection');

const DB_COLLECTION = 'Lexartlabs';

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

module.exports = { verifiesIfSearchAlreadyExists };
