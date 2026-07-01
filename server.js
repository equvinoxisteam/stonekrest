const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const root = __dirname;

app.disable('x-powered-by');
app.use(express.static(root, { maxAge: '1h', extensions: ['html'] }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'equvinoxis' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'mec.html'));
});

app.get('*', (req, res, next) => {
  if (req.path.includes('.')) return next();
  res.sendFile(path.join(root, 'mec.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Equvinoxis running on http://0.0.0.0:${PORT}`);
});
