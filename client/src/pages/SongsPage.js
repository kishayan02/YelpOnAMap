import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import {GiFastNoodles} from 'react-icons/gi';
import {FaHamburger} from 'react-icons/fa';
import SongCard from '../components/SongCard';
import ShoppingCart from '../components/ShoppingCart';
import { formatDuration } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');



export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  //
  const [restaurantData, setRestaurantData] = useState([]);
  // Sets currently examined restaurant
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Sets minimum number of stars for that restaurant
  const [stars, setStars] = useState([0, 5]);

  // Sets preferred cuisine for that restaurant
  const [cuisine, setCuisine] = useState('');

  // Sets minimum number of reviews wanted for that restaurant
  const [reviews, setReviews] = useState([0, 10000]);

  // Sets min and maximum average stars for a reviewer
  const [avgReviewerStars, setAvgReviewerStars] = useState(null);

  // Considers whether or not we only consider reviews from "elite" reviewers
  const [eliteOnly, setEliteOnly] = useState(false);

  // Hooks for each cuisine type
  const [disabled, setDisabled] = useState(false);

  const switchButton = () => {
    setDisabled(!disabled);
  }

  // Sets current name of restaurant
  const [title, setTitle] = useState('');

  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
      `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
      `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
      `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
      `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
      `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
      `&explicit=${explicit}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }
  const searchRestaurants = () => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_search?minstars=${stars[0]}` +
      `&minreviews=${reviews[0]}` + 
      `&maxstars=${stars[1]}` + 
      `&maxreviews=${reviews[1]}` + 
      `&eliteOnly=${eliteOnly}`
    )
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'name', headerName: 'Restaurant', width: 300},
    { field: 'stars', headerName: 'Stars' },
    { field: 'review_count', headerName: 'Reviews' },
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
      <Container>
      {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Search Restaurants</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Elite Reviewers Only'
            control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Number of Stars</p>
          <Slider
            value={stars}
            min={0}
            max={5}
            step={1}
            onChange={(e, newValue) => setStars(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Number of Reviews</p>
          <Slider
            value={reviews}
            min={0}
            max={10000}
            step={100}
            onChange={(e, newValue) => setReviews(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
          <p> Cuisine </p>
          <Grid item xs={1}>
            <Button disabled = {disabled} onClick={() => switchButton()}>
              Bruh
              <GiFastNoodles/>
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button disabled = {disabled} onClick={() => switchButton()}>
              Bruh
              <FaHamburger/>
            </Button>
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              label='Elite Reviewers Only'
              control={<Checkbox checked={'Chinese'} onChange={(e) => setCuisine('Chinese')} />}
            />
          </Grid>
      </Grid>
        
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
      <Button onClick={() => searchRestaurants() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={restaurantData}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

      <NavLink to={`/albums`}>THIS IS THE TEMPORARY SHOPPING CART</NavLink>
    </Container>
  );
}