import React, { Component } from 'react';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Profile from './Profile';
import './App.css';
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1/search';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
let token = '';
let tokenExpireTime = Date.parse(new Date());
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      artist: null,
    }
  }

  getArtist(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      }
    })
    .then(response => response.json())
    .then(json => {
      const artist = json.artists.items[0];
      console.log(json.artists.items[0]);
      this.setState({artist});
    });
  }
  search() {
    console.log((tokenExpireTime - Date.parse(new Date())))
    const fetchUrl = `${SPOTIFY_BASE_URL}?q=${this.state.query}&offset=0&limit=1&type=artist`;
    if(token === '' || (token && (tokenExpireTime - Date.parse(new Date()) <= 0))) {
      console.log('fetching token')
      fetch(SPOTIFY_AUTH_URL, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ZDU1OTI2NzM0ZDE4NDg1MTkxNWJlNmMyYzIwNWU2ZjE6ZjBkNmE1YTZmOGNjNGY3NDlmZGJjNzU5NDY0YzJlNGI=',
        }
      })
      .then(response => response.json())
      .then(json => {
        token = json.access_token;
        tokenExpireTime = Date.parse(new Date()) + json.expires_in * 1000;
        this.getArtist(fetchUrl)
      });
    } else {
      this.getArtist(fetchUrl)
    }
  }

  render() {
    return (
      <div className = 'App'>
        <div className = 'App-title'>Music Master</div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type = 'text'
              placeholder = 'Search for an artist'
              value = { this.state.query }
              onChange = { event => {this.setState({query: event.target.value})}}
              onKeyPress = {event => {
                if(event.key === 'Enter') {
                  this.search();
                }
              }}
            />
          <InputGroup.Addon onClick = {() => this.search()}>
              <Glyphicon glyph = 'search'></Glyphicon>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <Profile
          artist = {this.state.artist}
        />
        <div className = 'Gallery'>
          Gallery
        </div>
      </div>
    );
  }
}

export default App;
