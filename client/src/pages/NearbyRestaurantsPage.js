import { useEffect, useState } from 'react';
import { Box, Button, Container, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function NearbyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    { field: 'name', headerName: 'Restaurant', width: 300},
    { field: 'influential_rating', headerName: 'Influential Rating' , width : 200},
    { field: 'stars', headerName: 'Stars'},
    { field: 'city', headerName: 'City', width: 200},
    { field: 'state', headerName: 'State' },
  ]
    //influential_rating, stars, city, state
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/nearby_restaurants`)
        .then(res => res.json())
        .then(resJson => setRestaurants(resJson));
    }, []);


  return (
    <Container>
       <h2>Top Rated Restaurants by Influential Yelpers</h2>
        <Box>
        <DataGrid
            rows={restaurants}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            autoHeight
        />
        </Box>        
    </Container>
  );
}