import { useEffect, useState } from 'react';
import { Button, Container, Divider, Link, Box } from '@mui/material';
import { Form, NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import { lightBlue } from '@mui/material/colors';
const config = require('../config.json');

export default function RandomRestaurant() {

    const [restaurant, setRestaurant] = useState();

    const [selectedRestaurant, setSelectedRestaurant] = useState({});

    useEffect(() => {
        // fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
        //   .then(res => res.json())
        //   .then(resJson => {
        //     const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        //     setData(songsWithId);
        //   });
      }, []);
    
      const search = () => {
        // fetch(`http://${config.server_host}:${config.server_port}/search_songs?name=${name}` +
        //   `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
        //   `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
        //   `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
        //   `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
        //   `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
        //   `&explicit=${explicit}`
        // )
        //   .then(res => res.json())
        //   .then(resJson => {
        //     // DataGrid expects an array of objects with a unique id.
        //     // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        //     const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        //     setData(songsWithId);
        //   });
      }

      const addToCart = () => {
        let currCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        currCart.push(restaurant[0].id);
        sessionStorage.setItem('cart', JSON.stringify(currCart));
      }

      return (
        <Container>
            {selectedRestaurant && <SongCard restaurantId={selectedRestaurant} handleClose={() => setSelectedRestaurant(null)} />}
            <Box component="span" sx={{ p: 5, border: '1px black' }}>
                <div>
                    <Link onClick={() => setSelectedRestaurant(restaurant[0].id)}>
                        {restaurant[0].name}
                    </Link>
                </div>
                <h3> Address: {restaurant[0].address} </h3>
                <h3> Stars: {restaurant[0].stars} stars </h3>
                <h3> Cuisine: {restaurant[0].cuisine} </h3>
                <h3> Distance: {restaurant[0].distance} miles away </h3>
                <NavLink to="/albums">
                    See this restaurant's reviews!
                </NavLink>
                <Button onClick={addToCart}>
                    Add this restaurant to your cart!
                </Button>
            </Box>
        </Container>
      )
}