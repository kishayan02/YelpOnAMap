const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/', routes.hello);
app.get('/nearby_restaurants', routes.nearby_restaurants)
app.get('/restaurant_search', routes.search_restaurants)
app.get('/random_restaurant', routes.random_restaurant)
app.get('/cart', routes.get_cart)
app.get('/random_reviewer', routes.random_reviewer)
app.get('/cart_recommend', routes.cart_recommend)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
