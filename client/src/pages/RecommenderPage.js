import { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// import './style.css';
import 'ol/ol.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

function MapComponent({data}) {
  const [map, setMap] = useState(null);

  // const markersSource = new VectorSource();

  // // create a new vector layer for the markers
  // const markersLayer = new VectorLayer({
  //   source: markersSource,
  // });

  useEffect(() => {
    const newMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-98.5795, 39.8283]),
        zoom: 4,
      }),
    });
    // add the markers layer to the map
    // newMap.addLayer(markersLayer);
    setMap(newMap);

    return () => {
      newMap.dispose();
    };
    // create a vector source and layer for the markers
  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new Icon({
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    }),
  });
  newMap.addLayer(vectorLayer);

  // create a feature for each restaurant location
  const features = data.map(item => {
    const [longitude, latitude] = item.coordinates;
    return new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });
  });

  vectorSource.addFeatures(features);

  // return a cleanup function to remove the vector layer when the component unmounts
  return () => {
    newMap.removeLayer(vectorLayer);
  };
  }, []);

  // const vectorSource = new VectorSource();
  // const vectorLayer = new VectorLayer({
  //   source: vectorSource,
  //   style: new Style({
  //     image: new Icon({
  //       src: 'https://openlayers.org/en/latest/examples/data/icon.png',
  //     }),
  //   }),
  // });

  // map.addLayer(vectorLayer);

  // const features = data.map(item => {
  //   const [longitude, latitude] = item.coordinates;
  //   return new Feature({
  //     geometry: new Point(fromLonLat([longitude, latitude])),
  //   });
  // });

  // vectorSource.addFeatures(features);

  //   return () => {
  //     map.removeLayer(vectorLayer);
  //   };
  // }, [data, map]);

  return (
    <div id="map-container">
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
}

function addMarkersToMap(map, data) {
  const layer = new VectorLayer({
    source: new VectorSource(),
  });

  data.forEach((item) => {
    const marker = new Feature({
      geometry: new Point(fromLonLat([item.longitude, item.latitude])),
    });
    layer.getSource().addFeature(marker);
  });

  map.addLayer(layer);
}

function removeMarkersFromMap(map) {
  map.getLayers().forEach((layer) => {
    if (layer instanceof VectorLayer) {
      map.removeLayer(layer);
    }
  });
}

// function createMap() {
//   return new Map({
//     target: 'map',
//     layers: [
//       new TileLayer({
//         source: new OSM(),
//       }),
//     ],
//     view: new View({
//       center: fromLonLat([-98.5795, 39.8283]),
//       zoom: 4,
//     }),
//   });
// }

// function RestaurantMap({ data, map }) {
//   useEffect(() => {
//     if (map && data.length > 0) {
//       // create map layers and add them to the map
//       // add markers to the map based on the restaurant locations
//     }
//   }, [map, data]);

//   return null;
// }

export default function RecommenderPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [cuisine, setCuisine] = useState('');
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  // const [title, setTitle] = useState('');
  // const [duration, setDuration] = useState([60, 660]);
  // const [plays, setPlays] = useState([0, 1100000000]);
  // const [danceability, setDanceability] = useState([0, 1]);
  // const [energy, setEnergy] = useState([0, 1]);
  // const [valence, setValence] = useState([0, 1]);
  // const [explicit, setExplicit] = useState(false);
  

  useEffect(() => {
    console.log("useEffect running");
    fetch(`http://${config.server_host}:${config.server_port}/recommender`)
      .then(res => res.json())
      .then(resJson => {
        // const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        const restaurants = resJson.map((restaurant) => ({ id: restaurant.business_id, ...restaurant }));
        // setData(songsWithId);
        setData(restaurants);
      })
      .finally(() => {
        console.log("Creating new map...");
        const newMap = new Map({
          target: 'map',
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: fromLonLat([-98.5795, 39.8283]),
            zoom: 4,
          }),
        });
        // setMap(newMap);
        mapRef.current = newMap;
      });
      // .finally(() => {
      //   if (!mapRef.current) return; // Abort if map div doesn't exist yet
        
      //   const newMap = new Map({
      //     target: mapRef.current, // Use the ref to target the map div
      //     layers: [
      //       new TileLayer({
      //         source: new OSM(),
      //       }),
      //     ],
      //     view: new View({
      //       center: fromLonLat([-98.5795, 39.8283]),
      //       zoom: 4,
      //     }),
      //   });
      // });
  }, []);

  // useEffect(() => {
  //   if (!map) {
  //     const newMap = new Map({
  //       target: 'map',
  //       layers: [
  //         new TileLayer({
  //           source: new OSM(),
  //         }),
  //       ],
  //       view: new View({
  //         center: fromLonLat([-98.5795, 39.8283]),
  //         zoom: 4,
  //       }),
  //     });
  //     setMap(newMap);
  //     mapRef.current = newMap;
  //   } else {
  //     const mapInstance = mapRef.current;
  //     mapInstance.getView().setCenter(fromLonLat([-98.5795, 39.8283]));
  //     mapInstance.getView().setZoom(4);
  //   }
  // }, [map]);

  // useEffect(() => {
  //   setMap(createMap());
  // }, []);

  // useEffect(() => {
  //   if (mapRef.current && !map) {
  //     const newMap = new Map({
  //       target: mapRef.current,
  //       layers: [
  //         new TileLayer({
  //           source: new OSM(),
  //         }),
  //       ],
  //       view: new View({
  //         center: fromLonLat([-98.5795, 39.8283]),
  //         zoom: 4,
  //       }),
  //     });
  //     setMap(newMap);
  //   }
  // }, [map]);

  // useEffect(() => {
  //   removeMarkersFromMap(mapRef.current);
  //   addMarkersToMap(mapRef.current, data);
  // }, [data]);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/recommender?cuisine=${cuisine}`
      // `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
      // `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
      // `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
      // `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
      // `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
      // `&explicit=${explicit}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        // const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        // setData(songsWithId);
        const restaurants = resJson.map((restaurant) => ({ id: restaurant.business_id, ...restaurant }));
        setData(restaurants);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    ) },
    { field: 'cuisine', headerName: 'Cuisine' },
    { field: 'address', headerName: 'Address'},
    // { field: 'duration', headerName: 'Duration' },
    // { field: 'plays', headerName: 'Plays' },
    // { field: 'danceability', headerName: 'Danceability' },
    // { field: 'energy', headerName: 'Energy' },
    // { field: 'valence', headerName: 'Valence' },
    // { field: 'tempo', headerName: 'Tempo' },
    // { field: 'key_mode', headerName: 'Key' },
    // { field: 'explicit', headerName: 'Explicit' },
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
      <h2>Search Songs</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Cuisine' value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        {/* <Grid item xs={4}>
          <FormControlLabel
            label='Explicit'
            control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Duration</p>
          <Slider
            value={duration}
            min={60}
            max={660}
            step={10}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Plays (millions)</p>
          <Slider
            value={plays}
            min={0}
            max={1100000000}
            step={10000000}
            onChange={(e, newValue) => setPlays(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value / 1000000}</div>}
          />
        </Grid>
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
        {/* <Grid item xs={4}>
          <p>Danceability</p>
          <Slider
            value={danceability}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>Energy</p>
          <Slider
            value={energy}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setEnergy(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>Valence</p>
          <Slider
            value={valence}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setValence(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid> */}
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
        autoHeight
      />
      <div id='map' style={{ height: 400, width: '100%' }}></div>
      <div>{data && <MapComponent data={data}/>} </div>
    </Container>
  );
}