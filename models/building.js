var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BuildingSchema = new mongoose.Schema({
  name: String,
  blg_num: String,
  code: String,
  has_tap: Boolean,
  tap_locs: [{
      type: String
  }],
  lng: String,
  lat: String,
  nearest: String
});

//virtual for url
BuildingSchema
.virtual('url')
.get( function () {
  return '/' + this.code;
});

//export model
module.exports = mongoose.model("Building", BuildingSchema);
