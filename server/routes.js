const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: HOMEPAGE /
const hello = async function(req, res) {
  const userDate = new Date();
  
  const adjustedTimeDate = userDate.toLocaleString("en-US", {timeZone: "America/New_York"});

  const userDay = userDate.getDay();
  
  switch(userDay) {
    case 0:
      stringDay = 'Sunday';
      break;
    case 1:
      stringDay = 'Monday';
      break;
    case 2:
      stringDay = 'Tuesday';
      break;
    case 3:
      stringDay = 'Wednesday';
      break;
    case 4:
      stringDay = 'Thursday';
      break;
    case 5:
      stringDay = 'Friday';
      break;
    case 6:
      stringDay = 'Saturday';
      break;
    default:
        console.log("String Day error!");
  }

  const userTime = userDate.toJSON().slice(11, 19);
  res.send("Hi everybody " + adjustedTimeDate + "\n" + "Time: " + userTime + "Day: " + stringDay);
}
// // Route 1: GET /author/:type
// const author = async function(req, res) {
//   // TODO (TASK 1): replace the values of name and pennKey with your own
//   const name = 'John Doe';
//   const pennKey = 'jdoe';

//   // checks the value of type the request parameters
//   // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
//   if (req.params.type === 'name') {
//     // res.send returns data back to the requester via an HTTP response
//     res.send(`Created by ${name}`);
//   } else if (null) {
//     // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
//   } else {
//     // we can also send back an HTTP status code to indicate an improper request
//     res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
//   }
// }

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  //const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  
  const userDate = new Date();
  const userDay = userDate.getDay();

  switch(userDay) {
    case 0:
      stringDay = 'Sunday';
      break;
    case 1:
      stringDay = 'Monday';
      break;
    case 2:
      stringDay = 'Tuesday';
      break;
    case 3:
      stringDay = 'Wednesday';
      break;
    case 4:
      stringDay = 'Thursday';
      break;
    case 5:
      stringDay = 'Friday';
      break;
    case 6:
      stringDay = 'Saturday';
      break;
    default:
        console.log("String Day error!");
  }

  // ${stringDay}
  connection.query(`
    SELECT *, JSON_VALUE(hours, '$.*') AS time
    FROM Restaurants 
    ORDER BY RAND()
    LIMIT 3
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response

      //console.log(data[0].hours.slice(0, 20));

      res.json({
        restaurant_id: data,

      });
    }
  });
}

// /********************************
//  * BASIC SONG/ALBUM INFO ROUTES *
//  ********************************/

const nearby_restaurants = async function(req, res) {
  connection.query(`
      SELECT IR.business_id AS id, name, ROUND(influential_rating, 2) AS influential_rating, stars, city, state
      FROM (SELECT business_id, AVG(stars) as influential_rating
            FROM Reviews
            WHERE user_id IN (SELECT user_id
                              FROM Users
                              WHERE fans > 20)
            GROUP BY business_id
            HAVING AVG(stars) >= 4.0) IR
      JOIN Restaurants R ON IR.business_id = R.business_id
      WHERE state = 'PA' and city  = 'Philadelphia'
          AND (influential_rating > R.stars
          OR R.stars - influential_rating < 0.5 )
      ORDER BY influential_rating DESC
      LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received");
      res.json(data);
    }
  });
}

const search_restaurants = async function(req, res) {
  const minstars = req.query.minstars;
  const minreviews = req.query.minreviews;
  const maxstars = req.query.maxstars;
  const maxreviews = req.query.maxreviews;
  const eliteOnly = req.query.eliteOnly === 'true' ? 1 : 0;
  const restaurantName = req.query.restaurantName;
  const lat = req.query.latitude;
  const long = req.query.longitude;
  const maxDistance = req.query.dist;
  if (restaurantName == '') {
    if (eliteOnly == 1) {
      //just look at eliteOnly reviews
      connection.query(`
      SELECT R.business_id as id, name, stars, review_count, distance, address
      FROM (SELECT business_id, name, CONCAT(address," ",city,", ",state, " ", postal_code) as address, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371,2) AS distance
          FROM Restaurants
          WHERE ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}) R INNER JOIN  
          (SELECT business_id, ROUND(AVG(stars), 2) as stars, COUNT(*) as review_count
          FROM reviews_1
          WHERE user_id in (SELECT user_id FROM Users WHERE elite IS NOT NULL)
          GROUP BY business_id) E ON R.business_id = E.business_id
      WHERE stars >= ${minstars} and stars <= ${maxstars}
              AND review_count >= ${minreviews} and review_count <= ${maxreviews} 
      ORDER BY stars * review_count DESC;`
      , (err, data) => {
      if (err || data.length === 0) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.json({});
      } else {
        console.log("received - search_restaurants - elite");
        console.log(lat + "is lat and long: " + long);
        res.json(data);
      }
    });
    } else {
      //all reviews
      connection.query(`
      SELECT business_id as id, name, CONCAT(address," ",city,", ",state, " ", postal_code) as address, stars, review_count, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
      FROM Restaurants
      WHERE stars >= ${minstars} and stars <= ${maxstars}
          AND review_count >= ${minreviews} and review_count <= ${maxreviews}
          AND ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}
      ORDER BY stars * review_count DESC`
      , (err, data) => {
      if (err || data.length === 0) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.json({});
      } else {
        console.log("received - search_restaurants - non elite");
        console.log(lat + "is lat and long: " + long);
        res.json(data);
      }
    });
    }
  } else {
    //user has inputted restaurant name to search
    if (eliteOnly == 1) {
      //just look at eliteOnly reviews
      connection.query(`
      SELECT R.business_id as id, name, stars, review_count, distance, address
      FROM (SELECT business_id, name, CONCAT(address," ",city,", ",state, " ", postal_code) as address, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
             FROM Restaurants 
             WHERE ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}
                    AND name LIKE '%${restaurantName}%') R INNER JOIN  
          (SELECT business_id, ROUND(AVG(stars), 2) as stars, COUNT(*) as review_count
          FROM reviews_1
          WHERE user_id in (SELECT user_id FROM Users WHERE elite IS NOT NULL)
          GROUP BY business_id) E ON R.business_id = E.business_id
      WHERE stars >= ${minstars} and stars <= ${maxstars}
              AND review_count >= ${minreviews} and review_count <= ${maxreviews}
      ORDER BY stars * review_count DESC;`
      , (err, data) => {
      if (err || data.length === 0) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.json({});
      } else {
        console.log("received - search_restaurants - elite");
        console.log(lat + "is lat and long: " + long);
        res.json(data);
      }
    });
    } else {
      connection.query(`
      SELECT business_id as id, name, stars, review_count, CONCAT(address," ",city,", ",state, " ", postal_code) as address, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
      FROM Restaurants
      WHERE name LIKE '%${restaurantName}%'
          AND stars >= ${minstars} and stars <= ${maxstars}
          AND review_count >= ${minreviews} and review_count <= ${maxreviews}
          AND ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}
      ORDER BY stars * review_count DESC`
      , (err, data) => {
      if (err || data.length === 0) {
        // if there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        res.json({});
      } else {
        console.log("received - search_restaurants - non elite");
        console.log(lat + "is lat and long: " + long);
        res.json(data);
      }
    });
    }
  }
}

const random_restaurant = async function(req, res) {
  // default is Philly and 5 miles
  const lat = req.query.latitude ?? 39.9526;
  const long = req.query.longitude ?? 75.1652;
  const maxDistance = req.query.dist ?? 5;
  connection.query(`
  SELECT business_id as id, name, stars, review_count, CONCAT(address," ",city,", ",state, " ", postal_code) as address
  FROM Restaurants 
  ORDER BY RAND()
  LIMIT 1`
  , (err, data) => {
    //   WHERE ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      res.send("error");
      console.log(err);
      res.json({});
    } else {
      // return random  
      res.json(data);
    }
  });
}

// // Route 4: GET /album/:album_id
// const album = async function(req, res) {
//   // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
//   res.json({}); // replace this with your implementation
// }

// // Route 5: GET /albums
// const albums = async function(req, res) {
//   // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
//   // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
//   res.json([]); // replace this with your implementation
// }

// // Route 6: GET /album_songs/:album_id
// const album_songs = async function(req, res) {
//   // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
//   res.json([]); // replace this with your implementation
// }

// /************************
//  * ADVANCED INFO ROUTES *
//  ************************/

// // Route 7: GET /top_songs
// const top_songs = async function(req, res) {
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = undefined;

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//     res.json([]); // replace this with your implementation
//   } else {
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     res.json([]); // replace this with your implementation
//   }
// }

// // Route 8: GET /top_albums
// const top_albums = async function(req, res) {
//   // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
//   // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
//   res.json([]); // replace this with your implementation
// }

// // Route 9: GET /search_albums
// const search_songs = async function(req, res) {
//   // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
//   // Some default parameters have been provided for you, but you will need to fill in the rest
//   const title = req.query.title ?? '';
//   const durationLow = req.query.duration_low ?? 60;
//   const durationHigh = req.query.duration_high ?? 660;

//   res.json([]); // replace this with your implementation
// }

module.exports = {
  hello,
  random,
  nearby_restaurants,
  search_restaurants,
  random_restaurant
}
