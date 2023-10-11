let accessToken = "";
const clientID = "a26f128beb83492394706703b2d69377";
// const redirectURI = "http://localhost:3000/";
const redirectURI = "https://www.PulsePlay.surge.sh";

const Spotify = {
    getAccessToken() {

        if (accessToken) {
            return accessToken
        }
        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (urlAccessToken && urlExpiresIn) {
            accessToken = urlAccessToken[1];
            const expiresIn = Number(urlExpiresIn[1]);
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
        } else {
            const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = redirect;
        }
    },
    
    async search(term) {
      console.log(term);
      try {
        // Assuming Spotify.getAccessToken() sets the accessToken
        const accessToken = await this.getAccessToken();
        
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
    
        if (!response.ok) {
          console.error('Network response was not ok:', response.status, response.statusText);
          throw new Error('Network response was not ok');
        }
    
        const jsonResponse = await response.json();
    
        if (!jsonResponse.tracks) {
          return [];
        }
    
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      } catch (error) {
        console.error('Error during Spotify API request:', error);
        return [];
      }
    },
    
   
      
    async savePlaylistName(name, trackURIs) {
        if (!name || !trackURIs) {
          return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID = "";
        try {
          const response = await fetch("https://api.spotify.com/v1/me", { headers: headers });
          const jsonResponse = await response.json();
          userID = jsonResponse.id;
      
          const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ name: name }),
          });
      
          const playlistJsonResponse = await playlistResponse.json();
          const playlistID = playlistJsonResponse.id;
      
          const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackURIs }),
          });
    
          
          return addTracksResponse;
        } catch (error) {
          console.error("Error saving playlist:", error);
          throw error;
        }
       
      },
      
    };

export default Spotify;