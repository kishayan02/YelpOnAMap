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
  const cuisineSearch = req.query.cuisine;
  const jap = req.query.japanese;
  console.log("Hello");
  console.log(jap);
  console.log(cuisineSearch);
  console.log("Bye... grabbing restaurants");
  let result2 = cuisineSearch.replace(/_/g, " ");
  let result = result2.replace(/%27/g, "'");
  if (restaurantName == '') {
    if (eliteOnly == 1) {
      //just look at eliteOnly reviews
      connection.query(`
      SELECT R.business_id as id, name, stars, review_count, distance, address
      FROM (SELECT business_id, name, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371,2) AS distance
          FROM Restaurants
          WHERE ${result} ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}) R INNER JOIN  
          (SELECT business_id, ROUND(AVG(stars), 2) as stars, COUNT(*) as review_count
          FROM Reviews
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
      SELECT business_id as id, name, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, stars, review_count, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
      FROM Restaurants
      WHERE ${result} stars >= ${minstars} and stars <= ${maxstars}
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
      FROM (SELECT business_id, name, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
             FROM Restaurants 
             WHERE ${result} ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}
                    AND name LIKE '%${restaurantName}%') R INNER JOIN  
          (SELECT business_id, ROUND(AVG(stars), 2) as stars, COUNT(*) as review_count
          FROM Reviews
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
      SELECT business_id as id, name, stars, review_count, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
      FROM Restaurants
      WHERE ${result} name LIKE '%${restaurantName}%'
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
  const long = req.query.longitude ?? -75.1652;
  const maxDistance = req.query.dist ?? 5;
  connection.query(`
  SELECT business_id as id, name, stars, review_count, CONCAT(address," ",city,", ",state, " ", postal_code) as address
  FROM Restaurants 
  WHERE ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${maxDistance}
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
      res.json(data)
    }
  });
}

const restaurant_info = async function(req, res) {
  const business_id = req.query.restaurant_id;
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  console.log("getting - info");
  connection.query(`
    SELECT business_id as id, name, stars, review_count, ROUND(ST_Distance_Sphere(point(${longitude}, ${latitude}), point(longitude, latitude)) * 0.000621371, 2) as distance
    FROM Restaurants
    WHERE business_id = '${business_id}';
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      console.log("empty - info reviews");
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - info");
      
      res.json(data[0]);
      console.log(data[0]);
    }
  });
}
const restaurant_reviews_peek = async function(req, res) {
  console.log("getting - info reviews");
  const business_id = req.query.restaurant_id;
  connection.query(`
  SELECT R.review_id as id, text, stars
  FROM (SELECT review_id FROM ReviewsWithText_1 WHERE business_id = '${business_id}') R
  JOIN ReviewsWithText_1 R2 ON R.review_id = R2.review_id
  LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - info reviews");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - info reviews");
      
      res.json(data);
      console.log(data);
    }
  });
}

const restaurant_reviews_stare = async function(req, res) {
  console.log("getting - info reviews full");
  const business_id = req.query.restaurant_id;
  console.log(business_id);
  //(elite IS NULL) AS elite
  connection.query(`
  select name, average_stars, text, stars, id, elite
  FROM (SELECT user_id as id, text, stars FROM ReviewsWithText_1 WHERE business_id = '${business_id}' LIMIT 10) AS R
  JOIN (SELECT name, average_stars, user_id, (CASE
        WHEN (elite IS NULL) = 1 THEN "Yes"
        ELSE "No"
    END) AS elite FROM Users) U ON R.id = U.user_id
LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - info reviews full");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - info reviews full");
      
      res.json(data);
      console.log(data);
    }
  });
}

const recommender = async function(req, res) {
  const cuisine = req.query.cuisine ?? '';
  const minStars = req.query.minStars ?? 0;
  const minReviews = req.query.minReviews ?? 0;
  const distance = req.query.distance ?? 3000;
  const lat = req.query.lat ?? 39.952305;
  const long = req.query.long ?? -75.193703;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    WITH top_postal AS (
      SELECT postal_code
      FROM Restaurants
      WHERE categories LIKE '%${cuisine}%' AND
        stars >= ${minStars} AND review_count >= ${minReviews}
        AND ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371 <= ${distance}
      GROUP BY postal_code
      ORDER BY COUNT(name) DESC
      LIMIT 1
    )
    SELECT business_id, name, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, stars, latitude, longitude, review_count,
      ROUND(ST_Distance_Sphere(point(${long}, ${lat}), point(longitude, latitude)) * 0.000621371, 2) as distance
    FROM Restaurants
    WHERE postal_code = (SELECT postal_code FROM top_postal) 
      AND categories LIKE '%${cuisine}%' AND
      stars >= ${minStars} AND review_count >= ${minReviews}
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const get_cart = async function(req, res) {
  // const page = req.query.page;
  //const pageSize = req.query.page_size ?? 10;
  const currId = req.query.id;

  connection.query(`
  SELECT business_id as id, name, stars, review_count, city, CONCAT(address," ",city,", ",state, " ", postal_code) as address 
  FROM Restaurants 
  WHERE business_id LIKE '%${currId}%'`
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

  // var q = `
  //   SELECT business_id as id, name, stars, review_count, CONCAT(address," ",city,", ",state, " ", postal_code) as address 
  //   FROM Restaurants 
  //   WHERE business_id = '${currId}' `;

  // if (!page) {
  //   connection.query(q, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json([])
  //     } else{
  //       res.json(data);
  //     }
  //   });
  // } else {
  //   const offset = (page - 1) * pageSize; 
  //   q += `LIMIT ${pageSize} OFFSET ${offset}\n`;
  //   connection.query(q, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json([])
  //     } else{
  //       res.json(data);
  //     }
  //   });
}

const random_reviewer = async function(req, res) {
  const minReviewCount = req.query.review_count ?? 10;
  connection.query(`
  SELECT user_id as id, name, review_count, average_stars
  FROM Users 
  WHERE review_count >= ${minReviewCount}
  ORDER BY RAND()
  LIMIT 1`
  , (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // return random  
      res.json(data);
    }
  });
}

const cart_recommend = async function(req, res) {
  const chosenCity = req.query.city;
  connection.query(`
  WITH elite_users AS
  (SELECT user_id
    FROM Users
    WHERE elite IS NOT null)
  SELECT DISTINCT R.business_id as id, name, R.stars, review_count, CONCAT(address," ",city,", ",state, " ", postal_code) as address
  FROM Reviews S JOIN elite_users E ON E.user_id = S.user_id
      JOIN Restaurants R ON S.business_id = R.business_id
  WHERE city LIKE '%${chosenCity}%'
  ORDER BY R.stars DESC
  LIMIT 5;`
  , (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // return random  
      res.json(data);
    }
  });
}

const restaurant_get_name_from_id = async function(req, res) {
  console.log("getting - info name");
  const business_id = req.query.restaurant_id;
  
  connection.query(`
  SELECT name
  FROM Restaurants
  WHERE business_id = '${business_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - info  name");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - info  name");
      
      res.json(data[0]);
      console.log(data[0].name);
    }
  });
}


const influential_yelpsters_people = async function(req, res) {
  console.log("getting - yelpsters ppl");
  const minYear = req.query.year;
  const minReviews = req.query.reviews;
  const minUseful = req.query.useful;
  const minFans = req.query.fans;
  const minStarsAVG = req.query.minstars;
  const eliteOnly = req.query.eliteOnly === 'true' ? 1 : 0;
  if (eliteOnly === 1) {
    connection.query(`
    SELECT user_id as id, name, review_count, YEAR(yelping_since) as yelp_year, average_stars, fans, useful
    FROM Users
    WHERE YEAR(yelping_since) <= ${minYear} # default, change based on user input
        AND elite IS not NULL
        AND review_count >= ${minReviews} # default, change based on user input
        AND useful >= ${minUseful}
        AND fans >= ${minFans}
        AND average_stars >= ${minStarsAVG}
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - yelpsters ppl");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - yelpsters ppl");
      
      res.json(data);
      console.log(data);
    }
  });
  } else {
    connection.query(`
    SELECT user_id as id, name, review_count, YEAR(yelping_since) as yelp_year, average_stars, fans, useful
    FROM Users
    WHERE YEAR(yelping_since) <= ${minYear} # default, change based on user input
        AND review_count >= ${minReviews} # default, change based on user input
        AND useful >= ${minUseful}
        AND fans >= ${minFans}
        AND average_stars >= ${minStarsAVG}
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - yelpsters ppl");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - yelpsters ppl");
      
      res.json(data);
      console.log(data);
    }
  });
  }
}

const getInfluentialRecommendations  = async function(req, res) {
  console.log("getting - yelpsters rec");
  const minYear = req.query.year;
  const minReviews = req.query.reviews;
  const minUseful = req.query.useful;
  const minFans = req.query.fans;
  const minStarsAVG = req.query.minstars;
  const eliteOnly = req.query.eliteOnly === 'true' ? 1 : 0;

  if (eliteOnly === 1) {
    connection.query(`
    WITH users as (
      SELECT user_id
      FROM Users
      WHERE YEAR(yelping_since) <= ${minYear} # default, change based on user input
        AND elite is NOT NULL
          AND review_count >= ${minReviews} # default, change based on user input
          AND useful >= ${minUseful}
          AND fans >= ${minFans}
          AND average_stars >= ${minStarsAVG}
      LIMIT 10)
    SELECT name, id, address, B.stars, B.review_count
    FROM(
        SELECT business_id as id, ROUND(AVG(stars), 2) as stars, COUNT(*) as review_count
        FROM Reviews
        WHERE user_id IN (SELECT user_id FROM users)
        GROUP BY business_id
        )   B
    JOIN (SELECT name, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, business_id FROM  Restaurants) R ON B.id = R.business_id;

  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - yelpsters rec");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - yelpsters rec");
      
      res.json(data);
      console.log(data);
    }
  });
  } else {
    connection.query(`
    WITH users as (
      SELECT user_id
      FROM Users
      WHERE YEAR(yelping_since) <= ${minYear} # default, change based on user input
          AND review_count >= ${minReviews} # default, change based on user input
          AND useful >= ${minUseful}
          AND fans >= ${minFans}
          AND average_stars >= ${minStarsAVG}
      LIMIT 10)
    SELECT name, id, address, B.stars, B.review_count
    FROM(
        SELECT business_id as id, ROUND(AVG(stars), 2) as stars, COUNT(*) as review_count
        FROM Reviews
        WHERE user_id IN (SELECT user_id FROM users)
        GROUP BY business_id
        )   B
    JOIN (SELECT name, CONCAT(address,", ",city,", ",state, " ", postal_code) as address, business_id FROM  Restaurants) R ON B.id = R.business_id;

  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log("empty - yelpsters rec");
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      console.log("received - yelpsters rec");
      
      res.json(data);
      console.log(data);
    }
  });
  }
  
}


module.exports = {
  hello,
  random,
  nearby_restaurants,
  search_restaurants,
  recommender,
  restaurant_info,
  restaurant_reviews_peek,
  restaurant_reviews_stare,
  restaurant_get_name_from_id,
  influential_yelpsters_people,
  getInfluentialRecommendations,
  search_restaurants,
  random_restaurant,
  get_cart,
  random_reviewer,
  cart_recommend
}
