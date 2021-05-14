//request-response döngüsü içerisinde kalan herşeye middleware denir.

const express = require('express');
const path = require('path');

const app = express();

//MIDDLEWEARS
app.use(express.static('public'));

app.get('/', (req, res) => {
  //dirname benim proje klosörümün olduğu yer
  res.sendFile(path.resolve(__dirname, 'temp/index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı `);
});
