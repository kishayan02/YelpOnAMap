import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';

import { DataGrid, gridClasses } from '@mui/x-data-grid';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';
//import { use } from '../../../server/server';

const config = require('../config.json');

export default function ReviewsPage() {

  const queryParameters = new URLSearchParams(window.location.search);
  const [restaurant_Id, setRestaurant_Id] = useState(queryParameters.get("restaurant_id"));
  const [restaurant_Name, setRestaurant_Name] = useState(queryParameters.get("name"));

  //hook for the page size of the table
  const [pageSize, setPageSize] = useState(10);

  //hook for the data that'll be displayed in the table
  const [data, setData] = useState([]);

  //hook for the reviews of the restaurant
  const [reviews, setReviews] = useState([]);

  // constant for the id of the restaurant we're finding the reviews of
  const { restaurantId } = useParams();

  //hook for setting if we're only displaying reviews from elite users or not
  const [isElite, setElite] = useState(false);

  //hook for setting what we want the average reviewer's min and max average star rating to be
  const [avgStars, setAvgStars] = useState([0, 5]);

  const [restaurantName, setRestaurantName] = useState({});

  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_reviews_stare?restaurant_id=${restaurant_Id}`)
      .then(res => res.json())
      .then(resJson => setData(resJson));
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

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  const columns = [
    { field: 'name', headerName: 'Reviewer Name', width: 150},
    { field: 'text', headerName: 'Review', width: 700 },
    { field: 'stars', headerName: 'Rating', width: 100 },
    { field: 'elite', headerName: 'Elite?', width: 75 },
    { field: 'average_stars', headerName: 'Avg. Reviewer Stars', width: 100 },
  ]

  return (
    // TODO (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // TODO (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container>
      <h1>Reviews for {restaurant_Name}</h1>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <p>Average Rating of Reviewer</p>
          <Slider
              value={avgStars}
              min={0.0}
              max={5.0}
              step={0.5}
              onChange={(e, newValue) => setAvgStars(newValue)}
              valueLabelDisplay='auto'
            />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Elite Reviewers Only?'
            control={<Checkbox checked={isElite} onChange={(e) => setElite(e.target.checked)} />}
          />
        </Grid>
      </Grid>
        
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowHeight={() => 'auto'}
        sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1,
            },
          }}
        autoHeight
      />
    </Container>
  );
}