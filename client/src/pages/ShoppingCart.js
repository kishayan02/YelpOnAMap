import { useEffect, useState, useRef} from 'react';
import { Button, Stack, Box, Container, Divider, Link, TableContainer,  } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Form, NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import { lightBlue } from '@mui/material/colors';
import { FaMinus } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');

export default function ShoppingCart() {

    //hook to store the full restaurant information from each id within the cart
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [recommendation, setRecommendation] = useState([]);
    const randomCity = useRef('');
    let count = 0;

    //hook to store the data from the cart itself
    const [cartData, setCartData] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);

    const lat = sessionStorage.getItem("latitude") ?? 39.952305;
    const long = sessionStorage.getItem("longitude") ?? -75.193703;

    var inCart = [];
    var cities = [];

    useEffect(() => {
      count += 1;
      if (count%2 == 0) {
        for (let i = 0; i < cartData.length; i++) {
          if (cartData[i] != null) {
            fetch(`http://${config.server_host}:${config.server_port}/cart` +
            `?id=${cartData[i]}` + 
            `&lat=${lat}` + 
            `&long=${long}`)
              .then(res => res.json())
              .then(resJson => {setData(data => [...data, resJson[0]]); inCart.push(resJson[0]); cities.push(resJson[0].city)})
              .finally (() => {
                randomCity.current = cities[Math.floor(Math.random() * (cities.length))];
              });
          }
        }
      }
    }, []);
    
    // const search = (currId) => {
    //   fetch(`http://${config.server_host}:${config.server_port}/cart` +
    //         `?id=${currId}`)
    //     .then(res => res.json())
    //     .then(resJson => {setData(data => [...data, resJson[0]]); console.log(resJson); /* setTempData(resJson) */ inCart.push(resJson)});
    // }

    const removeFromCart = (e) => {
        let currCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        currCart.pop(e);
        sessionStorage.setItem('cart', JSON.stringify(currCart));
    }

    const cartColumns = [
        { field: 'name', headerName: 'Name', width: 300/*, renderCell: (params) => (
            <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
        ) */},
        { field: 'stars', headerName: 'Stars', width: 150 },
        { field: 'distance', headerName: 'Distance (mi)', width: 150 },
        { field: 'address', headerName: 'Address', width: 350 },
        { field: 'removefromcart', headerName: 'Remove from Cart', width: 200, 
            renderCell: (params) => {
            return (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => {
                        removeFromCart(params.row.selectedRestaurantId)
                        }}
                    >
                    <FaMinus size={8}/>
                    </Button>
                </strong>
            )
            }
        },
    ]

    const recColumns = [
      { field: 'name', headerName: 'Name', width: 350, align:"left"/*, renderCell: (params) => (
          <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
      ) */},
      { field: 'stars', headerName: 'Stars', width: 175, align:"left"},
      { field: 'review_count', headerName: 'Review Count', width: 175, align:"left" },
      { field: 'address', headerName: 'Address', width: 450 },
  ]
    
    const rows = inCart.map((t) => {
      console.log("t: " + t);
      return { name: t.name, stars: t.stars };
    });
  
    const generateRecommendations = () => {
      fetch(`http://${config.server_host}:${config.server_port}/cart_recommend` + 
      `?city=${randomCity.current}`)
        .then(res => res.json())
        .then(resJson => {setRecommendation(resJson); console.log(randomCity.current)});
    }

    return (
      <Container>
        <h2>Cart</h2>

        <DataGrid 
          rows={data}
          columns={cartColumns}
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
        <Button sx={{ border: 1 }} color="primary" onClick={() => generateRecommendations() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Generate Recommendations
        </Button>

        <h2>Recommendations</h2>

        <DataGrid 
          rows={recommendation}
          columns={recColumns}
          autoHeight
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Results
              </Stack>
            )
          }}
        />
      </Container>
    )
}