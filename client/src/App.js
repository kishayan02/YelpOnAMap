import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber, red, blue, pink } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import SongsPage from './pages/SongsPage';
import AlbumInfoPage from './pages/AlbumInfoPage';
import NearbyRestaurantsPage from './pages/NearbyRestaurantsPage';
import Random from './pages/Random';
import Cart from './pages/ShoppingCart';
import RecommenderPage from './pages/RecommenderPage';
import ReviewsPage from "./pages/ReviewsPage";
import YelpstersPage from "./pages/YelpstersPage";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: {main: "#C31919"},
    secondary: red,
    background: {
      default: "#F9F5F2",
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          {/* <Route path="/albums/:album_id" element={<AlbumInfoPage />} /> */}
          <Route path="/restaurantsearch" element={<SongsPage />} />
          <Route path="/nearby_restaurants" element={<NearbyRestaurantsPage />} />
          <Route path="/recommender" element={<RecommenderPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/restaurant_search" element={<SongsPage />} />
          <Route path="/nearby_restaurants" element={<NearbyRestaurantsPage />} />
          <Route path="/random" element={<Random />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/yelpsters" element={<YelpstersPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}