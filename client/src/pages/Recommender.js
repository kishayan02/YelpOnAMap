import { useEffect, useState } from 'react';
import { Button, Container, Divider, Link } from '@mui/material';
import { Form, NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import { lightBlue } from '@mui/material/colors';
const config = require('../config.json');

export default function Recommender() {

}