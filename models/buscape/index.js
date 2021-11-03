const puppeteer = require('puppeteer');
// const { getConnection } = require('../connection');

const { verifiesIfSearchAlreadyExists } = require('../helper');

// const DB_COLLECTION = 'Lexartlabs';

const fetchProducts = async (category, search) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.buscape.com.br/search?q=${category} ${search}`);

  const products = await page.evaluate(() => {
    const images = document.querySelectorAll('.Cell_Image__2-Jrs');
    const titles = document.querySelectorAll('[data-analytics-element="title"]');
    const prices = document.querySelectorAll('[data-analytics-element="price"] span strong');
    const links = document.querySelectorAll('[data-analytics-element="root-card"] span a');

    const imagesArray = [...images];
    const titlesArray = [...titles];
    const pricesArray = [...prices];
    const linksArray = [...links];

    const imagesList = imagesArray.map((img) => img.getAttribute('src'));
    const titlesList = titlesArray.map((el) => el.innerText);
    const pricesList = pricesArray.map((el) => el.innerText.split('').splice(3).join(''));
    const linksList = linksArray.map((el) => `https://www.buscape.com.br${el.getAttribute('href')}`);

    const teste = [];
    for (let i = 0; i < imagesList.length; i += 1) {
      teste[i] = {
        thumbnail: imagesList[i], // problem com src pois em algumas ocasiões vem uma url em base64.
        title: titlesList[i],
        price: pricesList[i],
        link: linksList[i],
        description: '',
      };
    }
    return teste;
  });

  await browser.close();
  return products;
};

const getProducts = async (data) => {
  const { category, search, web } = data;

  const productsList = await verifiesIfSearchAlreadyExists(category, search, web);
  if (productsList) return productsList.results;

  const products = await fetchProducts(category, search);
  return products;
};

module.exports = {
  getProducts,
};
