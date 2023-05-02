import { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

//OpenLayers Imports
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
import Overlay from 'ol/Overlay.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

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
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Sets minimum number of stars for that restaurant
  const [stars, setStars] = useState(0);
  // Sets minimum number of reviews wanted for that restaurant
  const [reviews, setReviews] = useState(0);

  // Sets max distance wanted for that restaurant
  const [distance, setDistance] = useState(100);
  // const [distanceV, setDistanceV] = useState([0, 50]);

  let count = 0;

  var markerLayer = new VectorLayer({
    source: new VectorSource(),
  });

  // Create a style for the markers
  // var markerStyle = new Style({
  //   image: new CircleStyle({
  //     radius: 5,
  //     fill: new Fill({color: 'red'}),
  //     stroke: new Stroke({color: 'white', width: 1}),
  //   }),
  //   text: new Text({
  //     text: '',
  //     font: '12px Calibri,sans-serif',
  //     fill: new Fill({color: 'black'}),
  //     offsetY: -10, // Offset the text above the marker
  //     stroke: new Stroke({color: 'white', width: 3}),
  //   }),
  // });
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
        const restaurants = resJson.map((restaurant) => ({ id: restaurant.business_id, lat:restaurant.latitude, lon:restaurant.longitude, ...restaurant }));
        setData(restaurants);
      })
      .finally(() => {
        count += 1;
        if (count >= 0) {
          console.log("Creating new map...");
          // var markerLayer = new VectorLayer({
          //   source: new VectorSource(),
          // });
          for (var i = 0; i < data.length; i++) {
            var row = data[i];
            
            var lat = row.latitude;
            var lon = row.longitude;
            console.log(lat);
            var marker = new Feature({
              geometry: new Point(fromLonLat([lat, lon])),
              name: row.name,
              add: row.address,
            });

            // marker.setStyle(markerStyle.clone()); // Use a clone of the marker style to avoid overwriting the text style
  
            // marker.getStyle().getText().setText(row.name); // Set the text label for the marker
          
            markerLayer.getSource().addFeature(marker);
          }      
        
          markerLayer.setZIndex(100); 

          const newMap = new Map({
          target: 'map',
          layers: [ 
            new TileLayer({
              source: new OSM(),
            }),
            markerLayer,
          ],
          view: new View({
            center: fromLonLat([-98.5795, 39.8283]),
            zoom: 4,
          }),
        });
        mapRef.current = newMap;
        setMap(newMap);
        const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
newMap.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
// display popup on click
newMap.on('click', function (evt) {
  const feature = newMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  popup.setPosition(evt.coordinate);
  popover = new bootstrap.Popover(element, {
    placement: 'top',
    html: true,
    content: feature.get('name'),
  });
  popover.show();
});
        // newMap.addLayer(markerLayer);
        }
        
        
        
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

  useEffect(() => {
    if (!data) return;
  
    const newSource = new VectorSource({
      features: data.map(row => {
        const lat = row.latitude;
        const lon = row.longitude;
        return new Feature({
          geometry: new Point(fromLonLat([lon, lat]))
        });
      })
    });
  
    markerLayer.setSource(newSource);
  }, [data]);

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
  //   // removeMarkersFromMap(mapRef.current);
  //   addMarkersToMap(mapRef.current, data);
  // }, [mapRef, data]);

  useEffect(() => {
    // Remove previous markers from the map
    if (map) {
      removeMarkersFromMap(map);
    }
    // Rest of the code...
  }, [data]);
  
  useEffect(() => {
    // Add new markers to the map
    if (map) {
      addMarkersToMap(map, data);
    }
  }, [data, map]);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/recommender?cuisine=${cuisine}` +
      `&minStars=${stars}&minReviews=${reviews}`
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
    // { field: 'cuisine', headerName: 'Cuisine', width: 300},
    { field: 'address', headerName: 'Address', width: 300},
    { field: 'city', headerName: 'City', width: 300},
    { field: 'state', headerName: 'State'},
    { field: 'postal_code', headerName: 'Zip Code'},
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
      <h2>Recommender</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Cuisine' value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
            <p>Max Distance</p>
            <Slider
              value={typeof distance === 'number' ? distance : 0}
              min={0}
              max={100}
              step={5}
              marks
              onChange={(e, newValue) => setDistance(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value + " miles"}</div>}
            />
            <Grid item>
          </Grid>
          
        </Grid>
  
        <Grid item xs={3}>
          <p>Min Stars</p>
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
          <p>Minimum Required Number of Reviews</p>
          <Slider
            value={reviews}
            min={0}
            max={10000}
            step={100}
            onChange={(e, newValue) => setReviews(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        {/* <Grid item xs={4}>
          <FormControlLabel
            label='Min Stars'
            control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
          />
        </Grid> */}
        {/* <Grid item xs={4}>
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
        </Grid> */}
        {/* <Grid item xs={6}>
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
      <div id='map' style={{ height: 500, width: '100%' }}><div id="popup"></div></div>
      <script src="https://cdn.jsdelivr.net/npm/elm-pep@1.0.6/dist/elm-pep.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
      {/* <div>{data && <MapComponent data={data}/>} </div> */}
    </Container>
  );
}