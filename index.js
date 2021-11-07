const app = require('express')();
const cors = require('cors');

const port = 3001;
const bodyParser = require('body-parser');
const mercadoLivreController = require('./controllers/mercadoLivre');
const buscapeController = require('./controllers/buscape');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));
app.use(bodyParser.json());

app.post('/mercadolivre/:id', mercadoLivreController.getProducts);
app.post('/buscape', buscapeController.getProducts);

app.listen(port);
