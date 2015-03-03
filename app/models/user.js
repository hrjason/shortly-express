var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',

  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var password = model.get('password');

      var update = function(result) {
        model.set('password', result);
      };

      bcrypt.hash(password, null, null, function (err, result) {
        update(result);
      });



      // var p = new Promise(function (resolve) {
      //   bcrypt.hash(password, null, null, function (err, result) {
      //     resolve(result);
      //   });
      // });
      // p.then(function(result){
      //   model.set('password', result);
      // });
    });
  }

});

module.exports = User;
