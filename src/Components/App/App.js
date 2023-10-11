import React from 'react';
import SearchBar from '../../SearchBar';
import SearchResults from '../../SearchResults/SearchResults';
import Playlist from '../../Playlist/Playlist';
import './App.css';
import  Spotify from '../../util/Spotify';

export class App extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {
      searchResults: [
      {
        name: 'Example Track Name',
        artist: 'Example Track Artist',
        album: 'Example Track Album',
        id: 1
      },
      {
        name: 'Example Track Name 2',
        artist: 'Example Track Artist 2',
        album: 'Example Track Album 2',
        id: 2
      }

    ],
    playlistName: 'Example playlist',
    playlistTracks: [
      {
        name: 'Example Playlist Track Name',
        artist: 'Example Playlist Track Artist',
        album: 'Example Playlist Track Album',
        id: 3
      },
      {
        name: 'Example Playlist Track Name 4',
        artist: 'Example Playlist Track Artist 4',
        album: 'Example Playlist Track Album 4',
        id: 4
      }
    ]

    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    Spotify.getAccessToken()
  }

  addTrack(track) {
    const foundTrack = this.state.playlistTracks.find(
      (playlistTrack) => playlistTrack.id === track.id
    );
    const newTrack = this.state.playlistTracks.concat(track);
    foundTrack ? console.log("Track already exists") : this.setState({playlistTracks: newTrack});
    }
  
 
  removeTrack(track) {
   const isPresent = this.state.playlistTracks.filter(
    (playlistTrack) => playlistTrack.id !== track.id);
   this.setState({playlistTracks: isPresent});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    const name = this.state.playlistName;
  
    // Make a single API request to save the playlist
    Spotify.savePlaylistName(name, trackURIs)
      .then(() => {
        // Playlist saved successfully
        console.log("Before state update:", this.state);
        this.setState({ playlistName: "New Playlist", playlistTracks: [] });
        console.log("After state update:", this.state);
      })
      .catch((error) => {
        console.error("Error saving playlist:", error);
      });
  
  

  }


  search(term) {
   Spotify.search(term)
    .then((result) => {
      this.setState({searchResults: result});
    })
    console.log(term);
  }

  render() {
  return (
   <div>
    <h1><span className="highlight">P</span>luse<span className="highlight">P</span>lay</h1>
      <div className='App'>
        <SearchBar onSearch={this.search}/>
      <div className='App-playlist'>
        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
        <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
      </div>
    </div>
   </div>
  );
}
}

export default App;
