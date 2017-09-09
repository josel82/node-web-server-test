const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express(); // express() creates an Express app. app is an instance of express
const port = process.env.PORT || 3000; //this configures our app to run with Heroku

//registers template parts
hbs.registerPartials(__dirname+'/views/partials');

//registers a function that we can call from a template
hbs.registerHelper('currentYear', ()=>{
  return new Date().getFullYear();
})
hbs.registerHelper('screamIt', (text)=>{
  return text.toUpperCase();
})
//app.use() binds application-level middleware to an instance of the app object

app.use((req, res, next)=>{

  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  fs.appendFile('server.log', log+'\n', (error)=>{
    if(error){
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//maintenance middleware, since we are not calling next() the app will stay here
// app.use((req, res, next)=>{
//   res.render('maintenance.hbs');
// });

//we place this middleware after the maintenance middleware because we don't want this directory
//to be available when in maintenance mode
app.use(express.static(__dirname+'/public'));
        //express.static(root, [options]) is the only built-in middleware function in Express.
        //It serves static files and is based on serve-static.
        //The root argument refers to the root directory from which the static assets are to be served.


//app.set() assigns setting name to value. You may store any value that you want,
//but certain names can be used to configure the behavior of the server.
app.set('view engine', 'hbs'); //here we are setting HandlebarsJs as our view engine.

//app.get routes HTTP GET requests to the specified path with the specified callback functions.
//this is how you set up routes. we use app.get()to create a route.
//It takes two arguments: path:string & a handler function (middleware system)
app.get('/',(req,res)=>{
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    wellcomeMessage: 'Wellcome to my page'
  });
});

app.get('/about', (req, res)=>{
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});
app.get('/bad',(req, res)=>{
  res.send({
    errorMessage:'Unable to handle the request.'
  });
});

//Binds and listens for connections on the specified host and port.
//This method is identical to Node’s http.Server.listen().
app.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});
