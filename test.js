const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', PhotoSchema); //yeni bir model oluşturuyoruz.

//create a photo
/* Photo.create({
  title: 'Photo Title 2',
  description: 'Photo description 2 lorem ipsum',
}); */

//read a photo
/* Photo.find({}, (err, data) => {
  console.log(data);
}); */

//update a photo
/* const id = '60a23c1c65ebcf340819593f';

Photo.findByIdAndUpdate(
  id,
  {
    title: 'we gonna update this photo',
    description: 'photo updated',
  },
  {
    new: true
  },
  (err, data) => {
    console.log(data);
  }
); */

//delete a photo
const id = "60a23e0e5b89bb2fd8900faa";
Photo.findByIdAndDelete(id, (err, data) => {
    console.log('Photo is removed')
})