var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var users = Promise.promisifyAll(db.username);
var compare = Promise.promisify(bcrypt.compare);

var User = db.Model.extend({
  tableName: 'users',

  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var password = model.get('password');

      bcrypt.hash(password, null, null, function(err, hash){
        //store hash in your passwordDB
        console.log('THE HASH: ', hash);
        model.set('password', hash);
        // console.log(model);
      });

      // // console.log('model: ', model);
      // var shasum = crypto.createHash('sha1');
      // shasum.update(model.get('url'));
      // model.set('code', shasum.digest('hex').slice(0, 5));

      //we have a table with username and password
      //username and hashed password
      //what's our salt?
    });
  }

});

module.exports = User;
