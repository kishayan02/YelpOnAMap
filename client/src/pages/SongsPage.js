import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import {GiFastNoodles, GiNoodleBall, GiSushis, GiChickenLeg, GiTacos} from 'react-icons/gi';
import {FaHamburger, FaPizzaSlice, FaBoxTissue, FaPlus} from 'react-icons/fa';
import {IoFastFood} from 'react-icons/io5';
import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');



export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  // Sets currently examined restaurant
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Sets minimum number of stars for that restaurant
  const [stars, setStars] = useState([0, 5]);

  // Sets preferred cuisine for that restaurant
  const [cuisine, setCuisine] = useState([]);

  // Sets minimum number of reviews wanted for that restaurant
  const [reviews, setReviews] = useState([0, 1000]);

  // Considers the max distance away from your location
  const [distance, setDistance] = useState([0, 10]);

  // Considers whether or not the restaurant is open at the user's current time.
  const [openNow, setOpenNow] = useState(false);

  // Hooks for each cuisine type
  const [burgers, setBurgers] = useState(false);
  const [chinese, setChinese] = useState(false);
  const [italian, setItalian] = useState(false);
  const [pizza, setPizza] = useState(false);
  const [japanese, setJapanese] = useState(false);
  const [mexican, setMexican] = useState(false);
  const [korean, setKorean] = useState(false);
  const [thai, setThai] = useState(false);
  const [fastFood, setFastFood] = useState(false);

  // Sets current name of restaurant
  const [name, setName] = useState('');

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
    fetch(`http://${config.server_host}:${config.server_port}/search_songs?name=${name}` +
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

  const addToCart = (e) => {
    let currCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    currCart.push(e);
    sessionStorage.setItem('cart', JSON.stringify(currCart));
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'name', headerName: 'Name', width: 250, renderCell: (params) => (
        <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    ) },
    { field: 'stars', headerName: 'Stars', width: 100 },
    { field: 'reviews', headerName: 'Reviews', width: 100 },
    { field: 'cuisine', headerName: 'Cuisine', width: 100 },
    { field: 'elite', headerName: 'Elite?', width: 100 },
    { field: 'distance', headerName: 'Distance', width: 100 },
    { field: 'address', headerName: 'Address', width: 100 },
    { field: 'addtocart', headerName: 'Add to Cart', width: 100, 
      renderCell: (params) => {
        return (
          <strong>
              <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginLeft: 16 }}
                  onClick={() => {
                    addToCart(params.row.selectedRestaurantId)
                  }}
              >
                <FaPlus size={8}/>
              </Button>
          </strong>
        )
      }
    },
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
          <TextField label='Restaurant Name' value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Open Now?'
            control={<Checkbox checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Distance (miles)</p>
          <Slider
            value={distance}
            min={0}
            max={100}
            step={1}
            onChange={(e, newValue) => setDistance(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Stars</p>
          <Slider
            value={stars}
            min={0}
            max={5}
            step={0.5}
            onChange={(e, newValue) => setStars(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        <Grid item xs={12}>
          <p>Review Number</p>
          <Slider
            value={reviews}
            min={0}
            max={1000}
            step={50}
            onChange={(e, newValue) => setReviews(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      <h4> Cuisine </h4>
      <Grid container spacing={0.8}>
          <Grid item xs={1.25}>
            <GiFastNoodles size={28} display={'flex'}/>
            <FormControlLabel
                label='Chinese'
                control={<Checkbox checked={chinese} onChange={(e) => setChinese(e.target.checked)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <FaHamburger size={28} display={'flex'}/>
              <FormControlLabel
                label='Burgers'
                control={<Checkbox checked={burgers} onChange={(e) => setBurgers(e.target.checked)} />}
              />
          </Grid>
          <Grid item xs={1.25}>
            <GiNoodleBall size={28} display={'flex'}/>
              <FormControlLabel
                label='Italian'
                control={<Checkbox checked={italian} onChange={(e) => setItalian(e.target.checked)} />}
              />
          </Grid>
          <Grid item xs={1.25}>
            <FaPizzaSlice size={28} display={'flex'}/>
              <FormControlLabel
                label='Pizza'
                control={<Checkbox checked={pizza} onChange={(e) => setPizza(e.target.checked)} />}
              />
          </Grid>
          <Grid item xs={1.25}>
            <GiSushis size={28} display={'flex'}/>
            <FormControlLabel
              label='Japanese'
              control={<Checkbox checked={japanese} onChange={(e) => setJapanese(e.target.checked)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <GiTacos size={28} display={'flex'}/>
            <FormControlLabel
              label='Mexican'
              control={<Checkbox checked={mexican} onChange={(e) => setMexican(e.target.checked)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <GiChickenLeg size={28} display={'flex'}/>
            <FormControlLabel
              label='Korean'
              control={<Checkbox checked={korean} onChange={(e) => setKorean(e.target.checked)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <FaBoxTissue size={28} display={'flex'}/>
            <FormControlLabel
              label='Thai'
              control={<Checkbox checked={thai} onChange={(e) => setThai(e.target.checked)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <IoFastFood size={28} display={'flex'}/>
            <FormControlLabel
              label='Fast Food'
              control={<Checkbox checked={fastFood} onChange={(e) => setFastFood(e.target.checked)} />}
            />
          </Grid>
      </Grid>
        
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
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
        autoHeight
      />
    </Container>
  );
}