var db = require('../config');
var Link = require('../models/link');

var Links = new db.Collection();
//relates to a model
Links.model = Link;
//relates to a module export
module.exports = Links;
