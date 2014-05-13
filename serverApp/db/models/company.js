var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  status: String,
  description: String,
  img: String,
  url: String,
  forum: Object,
  contacts: String,
  history: String,
  member: String,
  participation: {
    kind: String,
    payment: {
      price: Number,
      iva: Number,
      total: Number,
      date: String,
      invoice: String,
      status: String,
      via: String
    },
    items: {
      logos: {
        site: String,
        pens: String,
        tshirts: String,
        merchandise: String,
        banners: String,
        posters: String,
        flyers: String,
        folders: String,
        pens: String,
        individuals: String,
        rollups: String,
        showcase: String
      },
      stand: Number,
      presentation: Boolean,
      documentation: Boolean,
      posts: Number,
      workshop: Boolean,
      keynote: Boolean,
      innovationAwards: Boolean
    }
  },
  area: String,
  accesses: [{ 
    date: { type: Date, default: Date.now },
    where: String
  }],
  updated: { type: Date, default: Date.now }
});

companySchema.statics.findById = function (id, cb) {
  this.find({ id: id }, cb);
};

companySchema.statics.findByName = function (id, cb) {
  this.find({ name: id }, cb);
};

companySchema.statics.findByMember = function (id, cb) {
  this.find({ member: id }, cb);
};

companySchema.statics.findAll = function (cb) {
  this.find({},cb);
};

 
var Company = module.exports = mongoose.model('Company', companySchema);