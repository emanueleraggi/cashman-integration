const express = require('express');
const app = express();

app.get('/hey', (req, res) => res.send('Yo Server!'));

app.listen(8080);
