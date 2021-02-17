const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode.js');
const weather = require('./utils/weather.js');

const app = express();

// paths
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// views and paths
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

// relative path-
app.use(express.static(publicPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Harjot Singh Tathgur'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Harjot Singh Tathgur'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Harjot Singh Tathgur'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ 
      error: 'No Address Provided!'
    });
  }
  geocode(req.query.address, (error, {latitude, longitude, address} = {}) => {
    if (error) {
      return res.send({
        error: error
      });
    }
    weather({latitude, longitude}, (error, forecast) => {
      if (error) {
        return res.send({
          error: error
        });
      }
      return res.send({
        address,
        ...forecast
      });
    });
  });
});

app.get('/help/*', (req, res) => {
  res.send('Help page not found');
});

app.get('*', (req, res) => {
  res.send('Page not found');
});

app.listen('3000', () => {

});