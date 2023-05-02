import { useEffect, useState } from 'react';
import { Button, Container, Divider, Link,  } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Form, NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import { lightBlue } from '@mui/material/colors';
const config = require('../config.json');

export default function ShoppingCart() {

    //hook to store the full restaurant information from each id within the cart
    const [data, setData] = useState([]);

    //hook to store the data from the cart itself
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        // fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
        //   .then(res => res.json())
        //   .then(resJson => {
        //     const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        //     setData(songsWithId);
        //   });
        sessionStorage.getItem('cart')
            .then(res => res.json())
            .then(resJson => {
                setCartData(resJson);
                search();
            });
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

    return (
        <ResponsiveContainer height={250}>
                  <BarChart
                    data={data}
                    layout='vertical'
                    margin={{ left: 40 }}
                  >
                    <XAxis type='number' domain={[0, 1]} />
                    <YAxis type='category' dataKey='name' />
                    <Bar dataKey='value' stroke='#8884d8' fill='#8884d8' />
                  </BarChart>
        </ResponsiveContainer>
    )
}