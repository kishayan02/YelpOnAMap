import { AppBar, Container, Toolbar, Typography, IconButton, Badge, Button } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'ui-rounded',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const cartItems = JSON.parse(sessionStorage.getItem("cart"));
    if (cartItems) {
      setCartItemsCount(cartItems.length);
    }
  }, []);

  //TODO: CHANGE RECOMMENDER AND RANDOM FOR NEW LINKS
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='RESTAURANT HUNTER' isMain />
          <NavText href='/restaurantsearch' text='RESTAURANTS' />
          <NavText href='/recommender' text='RECOMMENDER' /> 
          <NavText href='/yelpsters' text="INFLUENTIAL YELPSTERS"/>
          <NavText href='/random' text='RANDOM!' />
          <Badge badgeContent={cartItemsCount} color='primary' sx={{ ml: 'auto' }}>
            <IconButton as="a" href="/cart" edge="end" color="inherit" aria-label="shoppingcart" sx={{ ml: 'auto' }}>
              <FaShoppingCart size={24} />
            </IconButton>
          </Badge>
        </Toolbar>
      </Container>
    </AppBar>
  );
}