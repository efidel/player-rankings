const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/tcg-rankings', db.getTcgRankings);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
