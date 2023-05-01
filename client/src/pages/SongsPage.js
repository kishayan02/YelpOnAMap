import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField, Input} from '@mui/material';
import Stack from '@mui/material/Stack';
import { DataGrid} from '@mui/x-data-grid';


import SongCard from '../components/SongCard';
//import ShoppingCart from '../components/ShoppingCart';

import {GiFastNoodles, GiNoodleBall, GiSushis, GiChickenLeg, GiTacos} from 'react-icons/gi';
import {FaHamburger, FaPizzaSlice, FaBoxTissue, FaPlus} from 'react-icons/fa';
import {IoFastFood} from 'react-icons/io5';
import { formatDuration } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');



export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const queryParameters = new URLSearchParams(window.location.search);
  const [userLat, setUserLat] = useState(queryParameters.get("latitude"));
  const [userLong, setUserLong] = useState(queryParameters.get("longitude"));
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
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Sets minimum number of stars for that restaurant
  const [stars, setStars] = useState([0, 5]);

  // Sets minimum number of reviews wanted for that restaurant
  //const [reviews, setReviews] = useState([0, 1000]);

  // Considers the max distance away from your location
  //const [distance, setDistance] = useState([0, 10]);

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
  // Sets preferred cuisine for that restaurant
  const cuisineNames = ["Burgers", "Chinese", "Italian", "Pizza", "Japanese", "Mexican", "Korean", "Thai", "Fast_Food"];
  const [cuisineBus, setCuisineBus] = useState([false, false, false, false, false, false, false, false, false]);
  const [cuisineSearch, setCuisineSearch] = useState("");
  // Sets minimum number of reviews wanted for that restaurant
  const [reviews, setReviews] = useState([0, 10000]);

  // Sets max distance wanted for that restaurant
  const [distance, setDistance] = useState(5);
  const [distanceV, setDistanceV] = useState([0, 50]);

  // Sets min and maximum average stars for a reviewer
  const [avgReviewerStars, setAvgReviewerStars] = useState(null);

  // Considers whether or not we only consider reviews from "elite" reviewers
  const [eliteOnly, setEliteOnly] = useState(false);
  const [eliteStarColumnName, setEliteStarColumnName] = useState("Stars");
  const [eliteReviewColumnName, setEliteReviewColumnName] = useState("Reviews");

  

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

  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [explicit, setExplicit] = useState(false);

  
  const searchRestaurants = () => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_search?minstars=${stars[0]}` +
      `&minreviews=${reviews[0]}` + 
      `&maxstars=${stars[1]}` + 
      `&maxreviews=${reviews[1]}` + 
      `&eliteOnly=${eliteOnly}` +
      `&restaurantName=${restaurantName}` +
      `&latitude=${userLat}` + 
      `&longitude=${userLong}` + 
      `&dist=${distance}` +
      `&cuisine=${cuisineSearch}`+ 
      `&japanese=${cuisineBus[4]}`
    )
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurant_search?minstars=${stars[0]}` +
      `&minreviews=${reviews[0]}` + 
      `&maxstars=${stars[1]}` + 
      `&maxreviews=${reviews[1]}` + 
      `&eliteOnly=${eliteOnly}` + 
      `&restaurantName=${restaurantName}` +
      `&latitude=${userLat}` + 
      `&longitude=${userLong}` + 
      `&dist=${distance}`+
      `&cuisine=${cuisineSearch}` + 
      `&japanese=${cuisineBus[4]}`
    )
      .then(res => res.json())
      .then(resJson => setRestaurantData(resJson));
  }, []);


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
    { field: 'name', headerName: 'Restaurant', width: 250, renderCell: (params) => (
      <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
  ) },
    { field: 'stars', headerName: eliteStarColumnName, width: 100 },
    { field: 'review_count', headerName: eliteReviewColumnName , width: 100 },
    { field: 'distance', headerName: "Distance (mi)", width : 100},
    { field: 'address', headerName: "Address", width: 300},
    { field: 'cuisine', headerName: 'Cuisine', width: 100 },
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
    }
  ]
  //burgers, chinese, italian, pizza, japanese, mexican, korean, thai, fastFood
  const eliteButtonClickChange = (e) => {
    setEliteOnly(e.target.checked)
  }

  const cuisineChange = (e, cuisineNum) => {
    let tempBus = cuisineBus;
    tempBus[cuisineNum] = e.target.checked;
    setCuisineBus(tempBus);
    finalizeCuisine();
    if (cuisineNum === 0) {
      setBurgers(e.target.checked);
    } else if (cuisineNum === 1) {
      setChinese(e.target.checked);
    } else if (cuisineNum === 2) {
      setItalian(e.target.checked);
    } else if (cuisineNum === 3) {
      setPizza(e.target.checked);
    } else if (cuisineNum === 4) {
      setJapanese(e.target.checked);
    } else if (cuisineNum === 5) {
      setMexican(e.target.checked);
    } else if (cuisineNum === 6) {
      setKorean(e.target.checked);
    } else if (cuisineNum === 7) {
      setThai(e.target.checked);
    } else if (cuisineNum === 8) {
      setFastFood(e.target.checked);
    }
    
  } 

  //categories_LIKE_'%Mexican%'_AND
  const finalizeCuisine = () => {
    let countCuisines = 0; 
    const cuisinesChecked = [];
    let returnString = "";
    for (let i = 0; i < cuisineBus.length; i++) {
      if (cuisineBus[i]) {
        cuisinesChecked[countCuisines] = cuisineNames[i];
        countCuisines += 1;
      }
    }
    if (cuisinesChecked.length === 1) {
      returnString += `(categories_LIKE_'%${cuisinesChecked[0]}%')_AND_`;
      setCuisineSearch(returnString);
    } else if (cuisinesChecked.length > 0) {
      //make string categories like ___ OR for all until last which is categories like ___ AND
      returnString +=  `(`;
      for (let i = 0; i < cuisinesChecked.length - 1; i++) {
        returnString += `categories_LIKE_'%${cuisinesChecked[i]}%'_OR_`;
      }
      returnString += `categories_LIKE_'%${cuisinesChecked[cuisinesChecked.length - 1]}%')_AND_`;
      console.log(returnString);
      setCuisineSearch(returnString);
    } else {
      //empty string since nada
      console.log("Empty");
      setCuisineSearch("");
    }
    
  }
  const searchButtonClickChange = () => {
    //first create and set cuisine search
    finalizeCuisine()
    searchRestaurants()
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
      {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Search Restaurants</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Restaurant Name' value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Elite Reviewers Only'
            control={<Checkbox checked={eliteOnly} onChange={(e) => eliteButtonClickChange(e)} />}
          />
        </Grid>
        <Grid item xs={3}>
            <p>Max Distance</p>
            <Slider
              value={typeof distance === 'number' ? distance : 0}
              min={0}
              max={50}
              step={5}
              marks
              onChange={(e, newValue) => setDistance(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value + " miles"}</div>}
            />
            <Grid item>
          </Grid>
          
        </Grid>
  
        <Grid item xs={2}>
          <p>Stars</p>
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
        
        <Grid item xs={5}>
          <p>Number of Reviews</p>
          <Slider
            value={reviews}
            min={0}
            max={10000}
            step={100}
            onChange={(e, newValue) => setStars(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
      </Grid>
      <h4> Cuisine </h4>
      <Grid container spacing={0.8}>
          <Grid item xs={1.25}>
            <GiFastNoodles size={28} display={'flex'}/>
            <FormControlLabel
                label='Chinese'
                control={<Checkbox checked={chinese} onChange={(e) => cuisineChange(e, 1)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <FaHamburger size={28} display={'flex'}/>
              <FormControlLabel
                label='Burgers'
                control={<Checkbox checked={burgers} onChange={(e) => cuisineChange(e, 0)} />}
              />
          </Grid>
          <Grid item xs={1.25}>
            <GiNoodleBall size={28} display={'flex'}/>
              <FormControlLabel
                label='Italian'
                control={<Checkbox checked={italian} onChange={(e) => cuisineChange(e, 2)} />}
              />
          </Grid>
          <Grid item xs={1.25}>
            <FaPizzaSlice size={28} display={'flex'}/>
              <FormControlLabel
                label='Pizza'
                control={<Checkbox checked={pizza} onChange={(e) => cuisineChange(e, 3)} />}
              />
          </Grid>
          <Grid item xs={1.25}>
            <GiSushis size={28} display={'flex'}/>
            <FormControlLabel
              label='Japanese'
              control={<Checkbox checked={japanese} onChange={(e) => cuisineChange(e, 4)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <GiTacos size={28} display={'flex'}/>
            <FormControlLabel
              label='Mexican'
              control={<Checkbox checked={mexican} onChange={(e) => cuisineChange(e, 5)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <GiChickenLeg size={28} display={'flex'}/>
            <FormControlLabel
              label='Korean'
              control={<Checkbox checked={korean} onChange={(e) => cuisineChange(e, 6)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <FaBoxTissue size={28} display={'flex'}/>
            <FormControlLabel
              label='Thai'
              control={<Checkbox checked={thai} onChange={(e) => cuisineChange(e, 7)} />}
            />
          </Grid>
          <Grid item xs={1.25}>
            <IoFastFood size={28} display={'flex'}/>
            <FormControlLabel
              label='Fast Food'
              control={<Checkbox checked={fastFood} onChange={(e) => cuisineChange(e, 8)} />}
            />
          </Grid>
      </Grid>
        
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
      <Button color="primary" onClick={() => searchButtonClickChange() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
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
        checkboxSelection
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Results
            </Stack>
          )
        }}
      />

      <NavLink to={`/albums`}>THIS IS THE TEMPORARY SHOPPING CART</NavLink>
    </Container>
  );
}