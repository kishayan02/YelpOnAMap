import { useEffect, useState } from 'react';
import { Button, Container, Box, Grid, Slider, TextField, Input} from '@mui/material';
import { Form, NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import { lightBlue } from '@mui/material/colors';
const config = require('../config.json');

export default function RandomRestaurant() {

  const [restaurantData, setRestaurantData] = useState([]);    
  const [reviewerData, setReviewerData] = useState([]);    
  // const [userLat, setUserLat] = useState(queryParameters.get("latitude"));
  // const [userLong, setUserLong] = useState(queryParameters.get("longitude"));
  const [userLat, setUserLat] = useState(null);
  const [userLong, setUserLong] = useState(null);
  const [distance, setDistance] = useState(5);
  const [distanceV, setDistanceV] = useState([0, 50]);
  const [minReviews, setMinReviews] = useState(10);
  
  if (userLat == null) {
    setUserLat(39.952305)
  }
  if (userLong == null) {
    setUserLong(-75.193703)
  }

  const generateRandomRestaurant = () => {
    fetch(`http://${config.server_host}:${config.server_port}/random_restaurant`  +
          `?latitude=${userLat}` + 
          `&longitude=${userLong}` + 
          `&dist=${distance}`)      
      .then(res => res.json())
      .then(resJson => {setRestaurantData(resJson[0]); console.log(resJson)});
  }

  const generateRandomReviewer = () => {
    fetch(`http://${config.server_host}:${config.server_port}/random_reviewer`  +
          `?review_count=${minReviews}`)      
      .then(res => res.json())
      .then(resJson => {setReviewerData(resJson[0]); console.log(resJson)});
  }

  // useEffect(() => {
  //   fetch(`http://${config.server_host}:${config.server_port}/random_restaurant`  +
  //         `?latitude=${39}` + 
  //         `&longitude=${-75}` + 
  //         `&dist=${100}`)
  //     .then(res => res.json())
  //     .then(resJson => {setRestaurantData(resJson[0]); console.log(resJson[0])});
  //     // console.log(restaurantData);
  // }, []);

  const addToCart = () => {
    let currCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    currCart.push(restaurantData[0].id);
    sessionStorage.setItem('cart', JSON.stringify(currCart));
  }

  // {restaurant && <SongCard restaurantId={restaurant} handleClose={() => setRestaurant(null)} />}
  return (
    <Container>
        <p style={{fontSize: 30}}> Generate a Random Restaurant! </p>
        <Grid item xs={3}>
          <p>Max Distance</p>
          <Slider
            value={typeof distance === 'number' ? distance : 0}
            min={0}
            max={50}
            step={5}
            onChange={(e, newValue) => setDistance(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value + " miles"}</div>}
          />
          <Grid item>
          <Input
            value={distance}
            size="small"
            onChange={(e, newValue) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
            /*onBlur={handleBlur}*/
            inputProps={{
              step: 5,
              min: 0,
              max: 50,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          </Grid>
        </Grid>
        <Button color="primary" onClick={() => generateRandomRestaurant() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Generate Restaurant
        </Button>
        <h2>Results</h2>
        {<Box component="span" sx={{ p: 2, border: '1px black' }}>
            <h3> Name: {restaurantData.name} </h3>
            <h3> Address: {restaurantData.address} </h3>
            <h3> Stars: {restaurantData.stars} stars </h3>
            <NavLink to="/albums">
                See this restaurant's reviews!
            </NavLink>
            <Button onClick={addToCart}>
                Add this restaurant to your cart!
            </Button>
        </Box>}

        <p style={{fontSize: 30}}> Generate a Random Reviewer! </p>
        <Grid item xs={3}>
          <p>Min Number of Reviews</p>
          <Slider
            value={typeof minReviews === 'number' ? minReviews : 0}
            min={0}
            max={100}
            step={5}
            onChange={(e, newValue) => setMinReviews(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value + " reviews"}</div>}
          />
          <Grid item>
          <Input
            value={minReviews}
            size="small"
            onChange={(e, newValue) => setMinReviews(e.target.value === '' ? '' : Number(e.target.value))}
            /*onBlur={handleBlur}*/
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          </Grid>
        </Grid>
        <Button color="primary" onClick={() => generateRandomReviewer() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Generate Reviewer
        </Button>
        <h2>Results</h2>
        {<Box component="span" sx={{ p: 2, border: '1px black' }}>
            <h3> Name: {reviewerData.name} </h3>
            <h3> Review Count: {reviewerData.review_count} </h3>
            <h3> Average Stars: {reviewerData.average_stars} stars </h3>
        </Box>}
    </Container>
  )
}