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

  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantData, setRestaurantData] = useState([]);    
  // const [userLat, setUserLat] = useState(queryParameters.get("latitude"));
  // const [userLong, setUserLong] = useState(queryParameters.get("longitude"));
  const [userLat, setUserLat] = useState('');
  const [userLong, setUserLong] = useState('');
  const [distance, setDistance] = useState(5);
  const [distanceV, setDistanceV] = useState([0, 50]);
  
  if (userLat == null) {
    setUserLat(39.952305)
  }
  if (userLong == null) {
    setUserLong(-75.193703)
  }

  const generateRandom = () => {
    fetch(`http://${config.server_host}:${config.server_port}/random_restaurant`)
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
    console.log(restaurantData);
  }

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random_restaurant`)
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }, []);

  const generateRandomClickChange = () => {
    generateRandom()
  }

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
        <Button color="primary" onClick={() => generateRandomClickChange() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Generate
        </Button>
        <h2>Results</h2>
        {<Box component="span" sx={{ p: 5, border: '1px black' }}>
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
    </Container>
  )
}