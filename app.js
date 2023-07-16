require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token'], console.log("API conectada")))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    spotifyApi.searchArtists('q')
      .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('index', { isIndexPage: true });
  
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });


  app.get('/artist-search', (req, res, next) => {
    const searchQuery = req.query.q; // Obtener el valor del parámetro de búsqueda 'q'
  
    spotifyApi.searchArtists(searchQuery)
      .then(data => {
        console.log('Los datos recibidos de la API: ', data.body);
        res.render('artist-search-results', { searchData: data.body.artists.items });
      })
      .catch(err => console.log('Ocurrió un error al buscar artistas: ', err));
  });


  app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        const albumsData = data.body.items; 
        res.render('albums', { artistId: artistId, albums: albumsData });
      })
      .catch(err => {
        console.log('Ocurrió un error al obtener los álbumes:', err);
        res.redirect('/error'); // Maneja el error de acuerdo a tu aplicación
      });
  });
  

  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        const tracksData = data.body.items;
        res.render('tracks', { albumId: albumId, tracks: tracksData });


      })
      .catch(err => {
        console.log('Ocurrió un error al obtener las pistas del álbum:', err);
        res.redirect('/error'); // Maneja el error de acuerdo a tu aplicación
      });
  });
  


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
