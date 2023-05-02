import { useEffect, useState } from 'react';
import { Button, Container, Divider, Link, Box, Typography} from '@mui/material';
import { Form, NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import { lightBlue } from '@mui/material/colors';
import mapsImg from './mapsimage.jpeg'; 
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [songOfTheDay, setSongOfTheDay] = useState({});

  // Added a state variable to keep track of the user time
  const [currUserTime, setUserTime] = useState({});

  // Added a state variable to keep track of user latitude
  const [userLatitude, setUserLatitude] = useState(0); //39.9522

  // Added a state variable to keep track of user longitude
  const [userLongitude, setUserLongitude] = useState(0); //-75.1932

  // Added a state variable to display status of geolocator search
  const [searchStatus, setSearchStatus] = useState(null);

  // Allows usage of hook form for nicer looking form
  const {register, getValues} = useForm();

  // History state/hook to route pathways
  const navigate = useNavigate();

  // Event Handler for the search bar
  let personalLocationButtonHandler = () => {
    if (!navigator.geolocation) {
      setSearchStatus("Location finding error! Please enable your location tracking and try again.");
    } else {
      // Gets the latitude and longitude of the user's location, returning an error if it fails
      navigator.geolocation.getCurrentPosition((position) => {
        setSearchStatus(null);
        // setUserLatitude(position.coords.latitude);
        // setUserLongitude(position.coords.longitude);
        sessionStorage.setItem("latitude", position.coords.latitude);
        sessionStorage.setItem("longitude", position.coords.longitude);
        let pathPersonal = `/restaurantsearch?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
        navigate(pathPersonal);
      }, () => {
        setSearchStatus("Unable to find your location! Please try again!");
      });
    }
  }

  let anyLocationButtonHandler = () => {
    if (getValues("latitude") != 0 && getValues("longitude") != 0) {
      const latValues = getValues("latitude");
      const longValues = getValues("longitude");

      let pathAny = `/restaurantsearch?latitude=${latValues}&longitude=${longValues}`;
      sessionStorage.setItem("latitude", latValues);
      sessionStorage.setItem("longitude", longValues);
      navigate(pathAny);
    } else {
      let pathAny = `/restaurantsearch?latitude=${userLatitude}&longitude=${userLongitude}`;
      sessionStorage.setItem("latitude", userLatitude);
      sessionStorage.setItem("longitude", userLongitude);
      navigate(pathAny);
    }
  }

  const [selectedSongId, setSelectedSongId] = useState(null);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setSongOfTheDay(resJson));

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
  }, []);

  const [restaurants, setRestaurants] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    { field: 'name', headerName: 'Restaurant', width: 300},
    { field: 'influential_rating', headerName: 'Influential Rating' , width : 200},
    { field: 'stars', headerName: 'Stars'},
    { field: 'city', headerName: 'City', width: 200},
    { field: 'state', headerName: 'State' },
  ]
    /*//influential_rating, stars, city, state
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/nearby_restaurants`)
        .then(res => res.json())
        .then(resJson => setRestaurants(resJson));
    }, []);*/

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const songColumns = [
    {
      field: 'title',
      headerName: 'Song Title',
      renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'album',
      headerName: 'Album',
      renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'plays',
      headerName: 'Plays'
    },
  ];

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  const albumColumns = [

  ]

  return (
    <Container>
      <br></br>
      <Typography variant="h2" component="h2" align="center" >
      Welcome to Restaurant Hunter!
     </Typography>
     <br></br>
     <Typography variant="h3" component="h3" align="center">
     By entering your coordinates, we'll provide you with the best places to eat!
     </Typography>
     <br></br>
     <br></br>

     <Typography variant="h4" component="h4" align="center">
     <Button 
        onClick={() => personalLocationButtonHandler()} background-color={lightBlue} border-radius={5} sx={{ border: 1 }}> 
        <Typography variant="h2" component="h2" align="center">
        Use My Location
      </Typography>
      </Button>
     </Typography>
     <br></br>
     <Typography variant="h5" component="h5" align="center">
        {searchStatus}
     </Typography>
     <br></br>
      <Divider />
      <br></br>
      <Typography variant="h3" component="h3" align="center">
      Enter another location's coordinates:
     </Typography>
     <br></br>
      <form align="center">
        <div className="form-control"> 
          <label><Typography variant="h5" component="h5" align="center">
          Latitude
     </Typography></label>
          <input type="number" name="latitude" {...register("latitude", {required: true})} />
        </div>
        <br></br>
        <div className="form-control"> 
          <label><Typography variant="h5" component="h5" align="center">
          Longitude
     </Typography></label>
          <input type="number" name="longitude" {...register("longitude", {required: true})} />
        </div>
        <br></br>
        <Button sx={{ border: 1 }}
          onClick={() => anyLocationButtonHandler()} background-color={lightBlue} border-radius={5}> 
          <Typography variant="h5" component="h5" align="center">
          Submit
     </Typography> 
        </Button>
      </form>

      
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {/*{selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
      <h2>Check out your song of the day:&nbsp;
        <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link>
      </h2>
      <Divider />
      <h2>Top Songs</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_songs`} columns={songColumns} />
      <Divider />
      {/*<img src = {mapsImg}></img>*/}
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
    </Container>
  );

};

