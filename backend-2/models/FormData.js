const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String,
    age: Number,
    height: Number,
    weight: Number,
  gender: String,
  foodPreference: String,
  allergies: [String],
  activityLevel: String,
})

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;