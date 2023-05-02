import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { DataGrid, gridClasses} from '@mui/x-data-grid';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function RestaurantCard({ restaurantId, lat, longi, handleClose }) {

  // constant to store the restaurant data
  //const [restaurantData, setRestaurantData] = useState({});
  const [restaurantData, setRestaurantData] = useState({});

  // constant hook to store the reviews data
  const [reviewsData, setReviewsData] = useState([]);
  const [pageSize, setPageSize] = useState(3);

  //const [barRadar, setBarRadar] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_card?restaurant_id=${restaurantId}` +
        `&latitude=${lat}` + 
        `&longitude=${longi}`
    )
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }, []);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_reviews_peek?restaurant_id=${restaurantId}`
    )
      .then(res => res.json())
      .then(resJson => setReviewsData(resJson));
  }, []);

  const chartData = [
    { name: 'Stars', value: restaurantData.stars },
    { name: 'Reviews', value: restaurantData.review_count },
    { name: 'Distance', value: restaurantData.distance },
  ];

  const handleGraphChange = () => {
    //Radar(!barRadar);
  };

  const handleAddToCart = () => {
    let currCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    currCart.push(restaurantData.id);
    sessionStorage.setItem('cart', JSON.stringify(currCart));
  };

  const columnsReviews = [
    { field: 'text', headerName: 'Review', width: 400},
    { field: 'stars', headerName: "Stars", width: 100 }
  ]

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
        <p>Reviews: {restaurantData.review_count} </p>
        <p>Stars: {restaurantData.stars}</p>
        <p>Distance: {restaurantData.distance} miles away</p>
        <NavLink to={`/reviews?restaurant_id=${restaurantData.id}&name=${restaurantData.name}`}>
          <Button>
            Click to see reviews for this restaurant!
          </Button>
        </NavLink>
        <ButtonGroup>
          {//<Button disabled={barRadar} onClick={handleGraphChange}>Bar</Button>}
}
        </ButtonGroup>
        <div style={{ margin: 20 }}>
            <DataGrid
                rows={reviewsData}
                columns={columnsReviews}
                pageSize={pageSize}
                rowsPerPageOptions={[3, 5, 10]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                components={{
                NoRowsOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                    No Reviews in Database
                    </Stack>
                )
                }}
            />
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