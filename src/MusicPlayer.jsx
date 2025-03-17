import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import { PlayArrow, Pause, Stop, Search } from "@mui/icons-material";

const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [artist, setArtist] = useState("Eminem");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(new Audio());

  const fetchTracks = async (artist = "Eminem") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${artist}`
      );
      setTracks(response.data.data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const playMusic = (track) => {
    if (currentTrack?.id !== track.id) {
      audioRef.current.src = track.preview;
      setCurrentTrack(track);
    }
    audioRef.current.play();
  };

  const pauseMusic = () => audioRef.current.pause();
  const resetMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTrack(null);
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "40px",
        background: "linear-gradient(135deg, #121212, #181818)",
        minHeight: "100vh",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#1DB954" mb={3}>
        🎵 React Music Player
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <TextField
          label="Search Artist"
          variant="outlined"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          sx={{
            width: "300px",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "#1DB954" },
          }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1DB954", color: "black", fontWeight: "bold" }}
          startIcon={<Search />}
          onClick={() => fetchTracks(artist)}
        >
          Search
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ color: "#1DB954", mb: 3 }} />}

      <Grid container spacing={3} justifyContent="center">
        {tracks.map((track) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
            <Card
              sx={{
                padding: "15px",
                borderRadius: "15px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
                color: "white",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent>
                <img
                  src={track.album.cover_big}
                  alt={track.title}
                  width="100%"
                  style={{ borderRadius: "12px", objectFit: "cover" }}
                />
                <Typography variant="h6" fontWeight="bold" mt={1}>
                  {track.title}
                </Typography>
                <Typography variant="subtitle1" color="#1DB954">
                  {track.artist.name}
                </Typography>

                <Box mt={1} display="flex" justifyContent="center" gap={1}>
                  <IconButton
                    sx={{ backgroundColor: "#1DB954", color: "black" }}
                    onClick={() => playMusic(track)}
                  >
                    <PlayArrow />
                  </IconButton>
                  <IconButton
                    sx={{ color: "white", borderColor: "white" }}
                    onClick={pauseMusic}
                  >
                    <Pause />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#f44336", borderColor: "#f44336" }}
                    onClick={resetMusic}
                  >
                    <Stop />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MusicPlayer;