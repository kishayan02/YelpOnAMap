import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField, Input} from '@mui/material';
import Stack from '@mui/material/Stack';
import { DataGrid} from '@mui/x-data-grid';


import SongCard from '../components/SongCard';
import RestaurantCard from '../components/RestaurantCard';
//import ShoppingCart from '../components/ShoppingCart';

import {GiFastNoodles, GiNoodleBall, GiSushis, GiChickenLeg, GiTacos} from 'react-icons/gi';
import {FaHamburger, FaPizzaSlice, FaBoxTissue, FaPlus} from 'react-icons/fa';
import {IoFastFood} from 'react-icons/io5';
import { formatDuration } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');



export default function YelpstersPage() {
  const [pageSize, setPageSize] = useState(10);
  // const [data, setData] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const queryParameters = new URLSearchParams(window.location.search);
  const [userLat, setUserLat] = useState(queryParameters.get("latitude"));
  const [userLong, setUserLong] = useState(queryParameters.get("longitude"));

  const [yelpsterData, setYelpsterData] = useState([]);
  //FOR WHEN NO ACCES TO DATA or default
  if (userLat == null) {
    setUserLat(39.952305)
  }
  if (userLong == null) {
    setUserLong(-75.193703)
  }


  const [restaurantName, setRestaurantName] = useState('');
  //
  const [restaurantData, setRestaurantData] = useState([]);
  // Sets currently examined restaurant
  

  

  // Sets minimum number of reviews wanted for that restaurant
  //const [reviews, setReviews] = useState([0, 1000]);

  // Considers the max distance away from your location
  //const [distance, setDistance] = useState([0, 10]);

  // Sets minimum number of reviews wanted for that restaurant
  // const [reviews, setReviews] = useState([0, 10000]);

  // Sets max distance wanted for that restaurant
  const [distance, setDistance] = useState(5);

  // Sets min and maximum average stars for a reviewer
  const [avgReviewerStars, setAvgReviewerStars] = useState(null);

  // Considers whether or not we only consider reviews from "elite" reviewers
  const [eliteOnly, setEliteOnly] = useState(false);
  const [eliteStarColumnName, setEliteStarColumnName] = useState("Stars");
  const [eliteReviewColumnName, setEliteReviewColumnName] = useState("Reviews");

// Sets minimum number of stars for that restaurant
  const [stars, setStars] = useState([0, 5]);
  const [reviews, setReviews] = useState(500);
  const [year, setYear] = useState(2005);
  const [fans, setFans] = useState(0);
  const [useful, setUseful] = useState(0);

  // Hooks for each cuisine type
  const [disabled, setDisabled] = useState(false);

  const switchButton = () => {
    setDisabled(!disabled);
  }

  // Sets current name of restaurant
  const [title, setTitle] = useState('');

  // Sets current name of restaurant
  //@EEEEE name -> restaurant
  const [name, setName] = useState('');
  
  
  const searchYelpers = () => {
    fetch(`http://${config.server_host}:${config.server_port}/influential_yelpsters_people?minstars=${stars[0]}` +
      `&reviews=${reviews}` + 
      `&maxstars=${stars[1]}` + 
      `&eliteOnly=${eliteOnly}` +
      `&year=${year}` + 
      `&fans=${fans}` + 
      `&useful=${useful}`
    )
      .then(res => res.json())
      .then(resJson => setYelpsterData(resJson));
  }

  const searchYelpstersRestaurants = () => {
    fetch(`http://${config.server_host}:${config.server_port}/getInfluentialRecommendations?minstars=${stars[0]}` +
      `&reviews=${reviews}` + 
      `&maxstars=${stars[1]}` + 
      `&eliteOnly=${eliteOnly}` +
      `&year=${year}` + 
      `&fans=${fans}` + 
      `&useful=${useful}`
    )
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/influential_yelpsters_people?minstars=${stars[0]}` +
      `&reviews=${reviews}` + 
      `&maxstars=${stars[1]}` + 
      `&eliteOnly=${eliteOnly}` +
      `&year=${year}` + 
      `&fans=${fans}` + 
      `&useful=${useful}`
    )
      .then(res => res.json())
      .then(resJson => setYelpsterData(resJson));
  }, []);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/getInfluentialRecommendations?minstars=${stars[0]}` +
      `&reviews=${reviews}` + 
      `&maxstars=${stars[1]}` + 
      `&eliteOnly=${eliteOnly}` +
      `&year=${year}` + 
      `&fans=${fans}` + 
      `&useful=${useful}`
    )
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }, []);

  



  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'average_stars', headerName: 'Average Star Rating', width: 200 },
    { field: 'review_count', headerName: 'Number of Reviews', width: 175 },
    { field: 'yelp_year', headerName: "Yelping Since", width: 175},
    { field: 'fans', headerName: 'Number of Fans', width: 175 },
    { field: 'useful', headerName: 'Useful Votes', wdith: 175}
  ]

  const restaurantColumns = [
    { field: 'name', headerName: 'Restaurant', width: 350, renderCell: (params) => (
        <Link onClick={() => setSelectedRestaurantId(params.row.id)}>{params.value}</Link>
    ) },
    { field: 'stars', headerName: 'Star Rating', width: 175 },
    { field: 'review_count', headerName: 'Elite Reviews', width: 175 },
    { field: 'address', headerName: "Address", width: 400}
  ]
  

  const searchButtonClickChange = () => {
    //first create and set cuisine search
    searchYelpers();
    searchYelpstersRestaurants();
    if (eliteOnly) {
      setEliteStarColumnName("Elite Stars")
      setEliteReviewColumnName("Elite Reviews")
    } else {
      setEliteStarColumnName("Stars")
      setEliteReviewColumnName("Reviews")
    }
  }
  

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
      <Container>
        {selectedRestaurantId && <RestaurantCard restaurantId={selectedRestaurantId} lat={userLat} longi={userLong} handleClose={() => setSelectedRestaurantId(null)} />}
      {/* {selectedRestaurantId && <RestaurantCard restaurantId={selectedRestaurantId} lat={userLat} longi={userLong} handleClose={() => setSelectedRestaurantId(null)} />} */}
      <h2>Search Yelpsters</h2>
      <Grid container spacing={6}>
        <Grid item xs={2}>
            <p>Yelping Since</p>
            <Slider
              value={year}
              min={2004}
              max={2023}
              step={1}
              marks
              onChange={(e, newValue) => setYear(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value}</div>}
            />
            <Grid item>
          </Grid>
          
        </Grid>
  
        <Grid item xs={2}>
          <p>Average Rating</p>
          <Slider
            value={stars}
            min={0}
            max={5}
            step={0.5}
            marks
            onChange={(e, newValue) => setStars(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        
        <Grid item xs={3}>
          <p>Minimum Number of Reviews</p>
          <Slider
            value={reviews}
            min={0}
            max={5000}
            step={100}
            onChange={(e, newValue) => setReviews(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>

        <Grid item xs={3}>
          <p>Number of Fans</p>
          <Slider
            value={fans}
            min={0}
            max={100}
            step={1}
            onChange={(e, newValue) => setFans(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>

        <Grid item xs={2}>
          <p>Useful</p>
          <Slider
            value={useful}
            min={0}
            max={100}
            step={1}
            onChange={(e, newValue) => setUseful(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>

      </Grid>
        
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
      <Button sx={{ border: 1 }} color="primary" onClick={() => searchButtonClickChange() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={yelpsterData}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Results
            </Stack>
          )
        }}
      />
      <br></br>
      <h2>Restaurants</h2>
      <DataGrid
        rows={restaurantData}
        columns={restaurantColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Results
            </Stack>
          )
        }}
      />
        <br></br>
        <h2> </h2>
    </Container>
  );
}