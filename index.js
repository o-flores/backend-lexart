const app = require('express')();

const port = 3000;
const bodyParser = require('body-parser');
const mercadoLivreController = require('./controllers/mercadoLivre');
const buscapeController = require('./controllers/buscape');

app.use(bodyParser.json());

app.get('/mercadolivre/:id', mercadoLivreController.getProducts);
app.get('/buscape', buscapeController.getProducts);

app.listen(port);
