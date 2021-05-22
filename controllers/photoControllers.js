const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1; // Başlangıç sayfamız veya ilk sayfamız.
  const photosPerPage = 3; //her sayfada gösterilmek istenen fotoğraf sayısı.

  const totalPhotos = await Photo.find().countDocuments(); //veri tabanımızdaki toplam döküman sayısı.

  const photos = await Photo.find({})
  .sort('-dateCreated')
  .skip((page-1) *photosPerPage)
  .limit(photosPerPage)//her sayfada göstermek istediğimiz fotoğraf sayısı.

  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage) // ondalıklı bulunan sayıyı ceil methodu ile yuvarlıyoruz
  })

  /*   console.log(req.query)
  const photos = await Photo.find({}).sort('-dataCreated'); //veritabanımdaki fotoğraflarımızı gösterecek
  res.render('index', {
    photos,
  }); */
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id); //modelimizde id yardımıyla hangi fotoğraf olduğunu buluyoruz
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage); // veri tabanındaki bilgileri silmesini istiyoruz.
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
