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
// app.get('/author/:type', routes.author);
app.get('/random', routes.random);
app.get('/nearby_restaurants', routes.nearby_restaurants)
app.get('/restaurant_search', routes.search_restaurants)
app.get('/recommender', routes.recommender)
app.get('/restaurant_card', routes.restaurant_info)
app.get('/restaurant_reviews_peek', routes.restaurant_reviews_peek)
app.get('/restaurant_reviews_stare', routes.restaurant_reviews_stare)
app.get('/restaurant_get_name_from_id', routes.restaurant_get_name_from_id)
app.get('/influential_yelpsters_people', routes.influential_yelpsters_people)
app.get('/getInfluentialRecommendations', routes.getInfluentialRecommendations)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
