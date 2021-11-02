const app = require('express')();

const port = 3000;
const bodyParser = require('body-parser');
const mercadoController = require('./controllers/mercadoLivre');

app.use(bodyParser.json());

app.get('/mercadolivre/:id', mercadoController.getProducts);

app.listen(port);
