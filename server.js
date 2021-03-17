const express = require('express');
const serveStatic = require('serve-static');

const app = express();
const port = process.env.PORT || 8080;

app.use(serveStatic('public'));

app.listen(port, () => {
  console.log(`Started : listening on ${port}`);
});
