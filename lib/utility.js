var request = require('request');
var bcrypt = require('bcrypt-nodejs');
var Users = require('../app/collections/users');
var User = require('../app/models/user');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/

// exports.hashPassword = function(password, cb){
//   var update = function(result) {
//     cb(result);
//   };
//   bcrypt.hash(password, null, null, function (err, result) {
//     update(result);
//   });
// };

// // new User(util.hashPassword(req.body.password));
//update callback
exports.hashPerson = function(req, res){
  var update = function(result) {
    new User({
      username: req.body.username,
      password: result
    }).save().then(function(newUser) {
      Users.add(newUser);
      res.redirect('/');
      // res.send(200, newUser);
    });
  };
  //hash the password
  bcrypt.hash(req.body.password, null, null, function (err, result) {
    update(result);
    // console.log('hash');
  });
};

exports.checkPassword = function(req, res, hash){
  var _username = req.body.username;
  // console.log(_username);
  var _password = req.body.password;
  // console.log(_password);
  var _hash = hash;

  //session url
  req.session.username = _username;
  req.session.password = _password;
  // console.log(req.session.hash);
  // console.log(req.session);

  var login = function(result) {
    if(result === true){
      // res.writeHead(200);
      // res.header.location('/');
      // res.redirect('/');
      res.end('logged in!');
      // res.redirect('/');
    } else {
      // res.writeHead(200);
      res.redirect('/login');
      res.end('wrong password!');
    }
  };
  //hash the password
  bcrypt.compare(_password, _hash, function (err, result) {
    login(result);
  });
};

exports.restrict = function(req, res, next){
  if(req.session.username){
    next();
  } else {
    req.session.error = 'Access denied';
    res.redirect('/login');
  }
};
