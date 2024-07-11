import { useEffect, useState } from "react"
import axios from 'axios';
import { AUTH_ENDPOINT, CLIENT_ID, REDIRECT_URI, RESPONSE_TYPE, toast } from '../utils/constants';
import { useForm } from "react-hook-form";
import { Box, Grid, IconButton, TextField } from "@mui/material";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AddCircle } from "@mui/icons-material";
import { ADD_SONGS, GET_PLAYLIST } from "../utils/actionURLs";
import UserPlaylistTable from "./playListTable";
import Swal from "sweetalert2";
import Navigation from "./Navigation";
import Loader from "./Loader";

const SearchSongs = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const userDetails = JSON.parse(localStorage.getItem("user"));

    const [tracks, setTracks] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [token, setToken] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Loading State
    const [isLoading, setIsLoading] = useState(false);
    const [pastSearch, setPastSearch] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        let token = localStorage.getItem("spotify_token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("spotify_token", token)
        }

        if (token) {
            setToken(token);
            setIsAuthorized(true);
        }
        fetchPlayList();

    }, []);

    const onSubmit = async (data) => {
        try {

            if (data.search === pastSearch) {
                return false;
            }

            setIsLoading(true);

            let spotify_token = localStorage.getItem("spotify_token");

            const { data: track_response } = await axios.get("https://api.spotify.com/v1/search", {
                headers: {
                    Authorization: `Bearer ${spotify_token}`
                },
                params: {
                    q: data.search,
                    type: "track" //type: "artist" to fetch artists
                }
            })

            setTracks(track_response.tracks.items);
            setPastSearch(data.search);
            setIsLoading(false);

        } catch (error) {
            if (error.response.data.error.message === "The access token expired") {
                localStorage.removeItem("spotify_token");
                setToken("");
                setIsAuthorized(false);
            }
            reset();
            setIsLoading(false);
            console.log("error ::", error);
            toast(error.response.data.error.message, "error");
        }
    }
    const fetchPlayList = async (data) => {
        try {

            setIsLoading(true);

            let url = GET_PLAYLIST.replace(":id", userDetails?._id);

            const response = await axios.get(url, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("user_token")}`
                }
            });

            if (response.data.success) {
                reset();
                setPlaylist(response.data.data);
            } else {
                setPlaylist([]);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }

    const handleAdd = (row) => {
        const dropdownOptions = playlist?.map(option => `<option value="${option._id}">${option.name}</option>`).join('');

        Swal.fire({
            icon: playlist.length ? "info" : "warning",
            title: 'Select your playlist',
            html: playlist.length ? `
            <select id="playlist_id" class="swal2-input">
              ${dropdownOptions}
            </select>
          ` : '<span>Please create a playlist to add the song!!</span>',
            focusConfirm: false,
            showCancelButton: true,
            showConfirmButton: playlist.length ? true : false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add Song!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                setIsLoading(true);

                const selectElement = document.getElementById('playlist_id');
                const selectedValue = selectElement.value;
                const selectedText = selectElement.options[selectElement.selectedIndex].text;
                const selectOption = { value: selectedValue, text: selectedText };

                const formData = {
                    name: row.name,
                    album: row.album.name,
                    artist: row.artists.map(artist => artist.name).join(', '),
                    images: row.album.images.map(image => image.url),
                    playlist_id: selectOption.value,
                    song_id: row.id
                };

                const response = await axios.post(ADD_SONGS, formData, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("user_token")}`
                    }
                });

                if (response.data.success) {
                    toast(response.data.message, "success");
                } else {
                    toast(response.data.message, "error");
                }

                setIsLoading(false);

            }
        });
    }

    const tracks_columns = [
        {
            field: "id",
            headerName: "Song ID",
            flex: 0.5,
            minWidth: 250,
        },
        {
            field: "name",
            headerName: "Song Name",
            flex: 0.5,
            minWidth: 115,
            valueFormatter: (params) => {
                if (params) {
                    return params
                }
                return "-";
            }
        },
        {
            field: "album",
            headerName: "Album",
            flex: 1,
            minWidth: 250,
            valueFormatter: (params) => {
                if (params) {
                    return params.name
                }
                return "-";
            }
        },
        {
            field: "artists",
            headerName: "Artist",
            flex: 1,
            minWidth: 200,
            valueFormatter: (params) => {
                if (params) {
                    return params.map(artist => artist.name).join(', ');
                }
                return "-";
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <div>
                    <IconButton
                        onClick={() => handleAdd(params.row)}
                        title="Add to playlist"
                    >
                        <AddCircle className="action-icon" color="info" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const handleAuthorize = () => {
        const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
        window.location.href = url;
    };

    return (
        <div className="App">
            <header className="App-header">
                {!isAuthorized ?
                    <Button
                        type="submit"
                        fullWidth
                        onClick={() => handleAuthorize()}
                        variant="contained"
                        style={{ width: "30%" }}
                    >
                        Please Authorize the Spotify to start
                    </Button>
                    :
                    <>

                        <Navigation from="search" />

                        <Box style={{ margin: "1% 0", minWidth: "30%" }}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="searchSongs"
                                    label="Search Songs"
                                    name="songs"
                                    autoComplete="songs"
                                    {...register("search", {
                                        required: 'Type to search the songs'
                                    })}
                                />
                                <Typography component="h1" variant="h5">
                                    {errors?.search?.type === 'required' && <span className="errormsg">{errors.search.message}</span>}
                                </Typography>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSubmit(onSubmit)}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Search Songs
                                </Button>
                            </Grid>
                        </Box>

                        {!isLoading ? (<>
                            {tracks.length > 0 && <UserPlaylistTable data={tracks} columns={tracks_columns} />}
                        </>) : <Loader />}

                    </>
                }

            </header >
        </div >
    );
}

export default SearchSongs;