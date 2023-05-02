import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';

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
  const [allReviews, setAllReviews] = useState(true);

  //hook for setting what we want the average reviewer's min and max average star rating to be
  const [avgStars, setAvgStars] = useState(3);

  const [restaurantName, setRestaurantName] = useState({});

  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_reviews_stare?restaurant_id=${restaurant_Id}`+
        `&all=${allReviews}` + 
        `&stars=${avgStars}` + 
        `&elite=${isElite}`  )
      .then(res => res.json())
      .then(resJson => setData(resJson));
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_reviews_stare?restaurant_id=${restaurant_Id}`+
        `&all=${allReviews}` + 
        `&stars=${avgStars}` + 
        `&elite=${isElite}` )
      .then(res => res.json())
      .then(resJson => setData(resJson));
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
        <Grid item xs={12}>
          
          <Stack spacing={1} direction="row" sx={{ mb: 1 }} alignItems="center">
          <Grid item xs={2}>
                <FormControlLabel
                label='All Reviews'
                control={<Checkbox checked={allReviews} onChange={(e) => setAllReviews(e.target.checked)} />}
                />
            </Grid>
          <Grid item xs={1.5}>
            <p>Review Ratings:</p>
                </Grid>
                
            <Grid item xs={2}>
                <Slider disabled={allReviews}
                value={avgStars}
                min={0.0}
                max={5.0}
                aria-labelledby="track-false-slider"
                step={1}
                track={false}
                marks
                onChange={(e, newValue) => setAvgStars(newValue)}
                valueLabelDisplay='auto'
                />
            </Grid>
            <Grid item xs={4}> <p> </p></Grid>
            <Grid item xs={4}>
                <FormControlLabel
                label='Elite Reviewers Only'
                control={<Checkbox checked={isElite} onChange={(e) => setElite(e.target.checked)} />}
                />
            </Grid>

            </Stack>
          
        </Grid>
      </Grid>
        
      <Button sx={{ border: 1 }} onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
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
      <br></br>
      <h2> </h2>
    </Container>
  );
}