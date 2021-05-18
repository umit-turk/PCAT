//request-response döngüsü içerisinde kalan herşeye middleware denir.

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');


const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

//TEMPLATE ENGINE
app.set('view engine', 'ejs'); //

//MIDDLEWEARS
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));//body bilgisini yakalamak için 2 adet middleware fonksiyonunu kullanmamız gerekir.
app.use(express.json());

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({})//veritabanımdaki fotoğraflarımızı gösterecek
  res.render('index', {
    photos
  });
});
app.get('/photos/:id', async (req, res) => {
  //res.render('about');
  const photo = await Photo.findById(req.params.id)//modelimizde id yardımıyla hangi fotoğraf olduğunu buluyoruz
  res.render('photo', {
    photo
  })
});


app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  //Burada "add photo" sayfadan gelen post metodunu yakalamamız için ilgili yönlendirmeyi yakalayıp, consolda request nesnesinden gelen body bilgisini yakalayalım.

  await Photo.create(req.body)//photomuzu req.body den gelen veriyi kullanacağız.
  res.redirect('/')
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı `);
});
