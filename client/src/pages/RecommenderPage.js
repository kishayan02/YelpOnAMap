import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function RecommenderPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [cuisine, setCuisine] = useState('');

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/recommender`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }, []);

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
        const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    ) },
    { field: 'duration', headerName: 'Duration' },
    { field: 'plays', headerName: 'Plays' },
    { field: 'danceability', headerName: 'Danceability' },
    { field: 'energy', headerName: 'Energy' },
    { field: 'valence', headerName: 'Valence' },
    { field: 'tempo', headerName: 'Tempo' },
    { field: 'key_mode', headerName: 'Key' },
    { field: 'explicit', headerName: 'Explicit' },
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
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={4}>
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
        autoHeight
      />
    </Container>
  );
}