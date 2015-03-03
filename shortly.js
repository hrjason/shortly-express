//runs express and assigns to a object variable.
var express = require('express');
// loads library utility
var util = require('./lib/utility');
var partials = require('express-partials');
//loads the body
var bodyParser = require('body-parser');

//database is fixe don config
var db = require('./app/config');
//collection is users
var Users = require('./app/collections/users');
//model is user
var User = require('./app/models/user');
//collection is links
var Links = require('./app/collections/links');
//model link
var Link = require('./app/models/link');
//click model
var Click = require('./app/models/click');

//app is now assigned to express model, and is invoked
var app = express();

//sets the express view directory
app.set('views', __dirname + '/views');
//view engine is set
app.set('view engine', 'ejs');

//app use partials whatever that may be
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
//loads default file in public
app.use(express.static(__dirname + '/public'));


app.get('/',
function(req, res) {
  res.render('index');
});

app.get('/create',
function(req, res) {
  res.render('index');
});

app.get('/links',
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

//sign up
app.get('/signup', function(req, res){
  res.render('signup');
});

//login
app.get('/login', function(req, res){
  res.render('login');
});

//post to create users
app.post('/signup', function(req, res) {
  new User({username: req.body.username, password: req.body.password}).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      var user = new User({
        username: req.body.username,
        password: req.body.password,
      });

      // console.log('user: ', user);
      // console.log('user-save: ', user.save());
      user.save().then(function(newUser) {
        Users.add(newUser);
        res.send(200, newUser);
      });
    }
  });
});
/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        db.knex('urls')
          .where('code', '=', link.get('code'))
          .update({
            visits: link.get('visits') + 1,
          }).then(function() {
            return res.redirect(link.get('url'));
          });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
