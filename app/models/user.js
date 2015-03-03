var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',

  initialize: function(){
    this.on('saving', function(model, attrs, options){
      // console.log('test');
      // var password = model.get('password');
      // console.log(password);
      // var update = function(result) {
      //   model.set('password', result);
      // };
      // bcrypt.hash(password, null, null, function (err, result) {
      //   update(result);
      // });

    });
  }

});

module.exports = User;

      // user.save().then(function(newUser) {
      //   Users.add(newUser);
      //   res.send(200, newUser);
      // });

      // var p = new Promise(function (resolve) {
      //   bcrypt.hash(password, null, null, function (err, result) {
      //     resolve(result);
      //   });
      // });
      // p.then(function(result){
      //   model.set('password', result);
      // });
