//request-response döngüsü içerisinde kalan herşeye middleware denir.

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');
const fileUpload = require('express-fileupload'); // modülü kullanıma alıyoruz.
const fs = require('fs');
const methodOverride = require('method-override');
const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db'),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

//TEMPLATE ENGINE
app.set('view engine', 'ejs'); //

//MIDDLEWEARS
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //body bilgisini yakalamak için 2 adet middleware fonksiyonunu kullanmamız gerekir.
app.use(express.json());
app.use(fileUpload()); // middleware olarak kaydediyoruz.
app.use(methodOverride('_method'));

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dataCreated'); //veritabanımdaki fotoğraflarımızı gösterecek
  res.render('index', {
    photos,
  });
});
app.get('/about', async (req, res) => {
  res.render('about');
});
app.get('/photos/:id', async (req, res) => {
  //res.render('about');
  const photo = await Photo.findById(req.params.id); //modelimizde id yardımıyla hangi fotoğraf olduğunu buluyoruz
  res.render('photo', {
    photo,
  });
});

app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  //Burada "add photo" sayfadan gelen post metodunu yakalamamız için ilgili yönlendirmeyi yakalayıp, consolda request nesnesinden gelen body bilgisini yakalayalım.

  //await Photo.create(req.body)//photomuzu req.body den gelen veriyi kullanacağız.
  // res.redirect('/')
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı `);
});
