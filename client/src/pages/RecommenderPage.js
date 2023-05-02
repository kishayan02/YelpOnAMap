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

import RestaurantCard from '../components/RestaurantCard';
const config = require('../config.json');

//function to add markers to the map
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

//function to remove markers from the map
function removeMarkersFromMap(map) {
  map.getLayers().forEach((layer) => {
    if (layer instanceof VectorLayer) {
      map.removeLayer(layer);
    }
  });
}

export default function RecommenderPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  
  //Sets cuisine
  const [cuisine, setCuisine] = useState('');
  //Reference for the map
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Sets minimum number of stars for that restaurant
  const [stars, setStars] = useState(0);
  // Sets minimum number of reviews wanted for that restaurant
  const [reviews, setReviews] = useState(0);

  // Sets max distance wanted for that restaurant
  const [distance, setDistance] = useState(3000);

  const lat = sessionStorage.getItem("latitude") ?? 39.952305;
  const long = sessionStorage.getItem("longitude") ?? -75.193703;

  let count = 0;

  var markerLayer = new VectorLayer({
    source: new VectorSource(),
  });  

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
        if (count >= 2) {
          console.log("Creating new map...");
          for (var i = 0; i < data.length; i++) {
            var row = data[i];
            
            var lat = row.latitude;
            var lon = row.longitude;
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

  useEffect(() => {
    // Remove previous markers from the map
    if (map) {
      removeMarkersFromMap(map);
    }
  }, [data]);
  
  useEffect(() => {
    // Add new markers to the map
    if (map) {
      addMarkersToMap(map, data);
    }
  }, [data, map]);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/recommender?cuisine=${cuisine}` +
      `&minStars=${stars}&minReviews=${reviews}&distance=${distance}&lat=${lat}&long=${long}`
    )
      .then(res => res.json())
      .then(resJson => {
        console.log(stars);
        console.log(reviews);
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        console.log(resJson);
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
      <Link onClick={() => setSelectedRestaurantId(params.row.id)}>{params.value}</Link>
    ) },
    { field: 'address', headerName: 'Address', width: 500},
    { field: 'stars', headerName: 'Stars'},
    { field: 'review_count', headerName: '# Reviews'},
    { field: 'distance', headerName: 'Distance (miles)', width: 200}
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
      {selectedRestaurantId && <RestaurantCard restaurantId={selectedRestaurantId} lat={lat} longi={long} handleClose={() => setSelectedRestaurantId(null)} />}
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
              max={3000}
              step={10}
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
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <div id='map' style={{ height: 500, width: '100%' }}><div id="popup"></div></div>
      <script src="https://cdn.jsdelivr.net/npm/elm-pep@1.0.6/dist/elm-pep.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
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