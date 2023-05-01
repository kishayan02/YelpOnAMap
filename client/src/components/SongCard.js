import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function SongCard({ restaurantId, handleClose }) {

  // constant to store the restaurant data
  const [restaurantData, setRestaurantData] = useState({});

  // constant hook to store the reviews data
  const [reviewsData, setReviewsData] = useState({});
  
  const [songData, setSongData] = useState({});
  const [albumData, setAlbumData] = useState({});

  const [barRadar, setBarRadar] = useState(true);

  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => {
    // Hint: here is some pseudocode to guide you
    // fetch(song data, id determined by songId prop)
    //   .then(res => res.json())
    //   .then(resJson => {
    //     set state variable with song dta
    //     fetch(album data, id determined by result in resJson)
    //       .then(res => res.json())
    //       .then(resJson => set state variable with album data)
    //     })
  }, []);

  const chartData = [
    { name: 'Stars', value: restaurantData.stars },
    { name: 'Reviews', value: restaurantData.energy },
    { name: 'Distance', value: restaurantData.distance },
  ];

  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };

  const handleAddToCart = () => {
    let currCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    currCart.push(restaurantData.id);
    sessionStorage.setItem('cart', JSON.stringify(currCart));
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h1>{restaurantData.name}</h1>
        <p>Reviews: {restaurantData.reviews} reviews</p>
        <p>Stars: {restaurantData.stars} stars</p>
        <p>Distance: {restaurantData.distance} miles away</p>
        <NavLink to={`/albums/${albumData.album_id}`}>
          <Button>
            Click to see reviews for this restaurant!
          </Button>
        </NavLink>
        <ButtonGroup>
          <Button disabled={barRadar} onClick={handleGraphChange}>Bar</Button>
          <Button disabled={!barRadar} onClick={handleGraphChange}>Radar</Button>
        </ButtonGroup>
        <div style={{ margin: 20 }}>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={250}>
                  <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ left: 40 }}
                  >
                    <XAxis type='number' domain={[0, 1]} />
                    <YAxis type='category' dataKey='name' />
                    <Bar dataKey='value' stroke='#8884d8' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={250}>
                  {/* TODO (TASK 21): display the same data as the bar chart using a radar chart */}
                  {/* Hint: refer to documentation at https://recharts.org/en-US/api/RadarChart */}
                  {/* Hint: note you can omit the <Legend /> element and only need one Radar element, as compared to the sample in the docs */}
                  <RadarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ left: 40 }}
                  >
                    <XAxis type='number' domain={[0, 1]} />
                    <YAxis type='category' dataKey='name' />
                    <Bar dataKey='value' stroke='#8884d8' fill='#8884d8' />
                  </RadarChart>
                </ResponsiveContainer>
              )
          }
        </div>
        <Button onClick={handleAddToCart} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Add to Cart
        </Button>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}