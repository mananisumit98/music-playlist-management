import { useEffect, useRef, useState } from "react"
import axios from 'axios';
import { toast } from '../utils/constants';
import { useForm } from "react-hook-form";
import { Box, Grid, IconButton, TextField } from "@mui/material";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { EditSharp, DeleteForeverSharp, RemoveRedEyeSharp } from "@mui/icons-material";
import { DELETE_PLAYLIST, GET_PLAYLIST, NEW_PLAYLIST, FETCH_SONGS, DELETE_SONGS, DELETE_SONG } from "../utils/actionURLs";
import UserPlaylistTable from "./playListTable";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { DASHBOARD, PLAYLIST, SEARCH } from "../utils/routes";

const Dashboard = () => {

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const userDetails = JSON.parse(localStorage.getItem("user"));
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const params = useParams();
    const { id: playlist_id } = params;

    const [songs, setSongs] = useState([]);
    console.log("songs ::: ", songs);

    useEffect(() => {
        fetchSongs();
    }, []);
    const fetchSongs = async (data) => {
        try {

            let url = FETCH_SONGS.replace(":id", playlist_id);

            const response = await axios.get(url);

            if (response.data.success) {
                reset();
                setSongs(response.data.data);
            } else {
                setSongs([]);
            }
        } catch (error) {
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }

    const refresh = () => {
        fetchSongs();
    }

    const handleAdd = async (row) => {
        try {

            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this song?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let url = DELETE_SONG.replace(":id", row._id);

                    const response = await axios.delete(url);
                    console.log("response.data ::: ", response.data);

                    if (response.data.success) {
                        refresh();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your playlist has been deleted.",
                            icon: "success"
                        });
                    } else {
                        setSongs([]);
                    }

                }
            });

        } catch (error) {
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }

    const song_columns = [
        {
            field: "name",
            headerName: "Song Name",
            flex: 0.5,
            minWidth: 115
        },
        {
            field: "album",
            headerName: "Album",
            flex: 1,
            minWidth: 250
        },
        {
            field: "artist",
            headerName: "Artist",
            flex: 1,
            minWidth: 200
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <div>
                    <IconButton
                        onClick={() => handleAdd(params.row, "delete")}
                        title="Delete Song"
                    >
                        <DeleteForeverSharp className="action-icon" color="error" />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="App">
            <header className="App-header">
                <Box style={{ margin: "1% 0" }}>
                    <Grid item xs={12}>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={() => navigate(DASHBOARD)}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            Back to dashboard
                        </Button>
                    </Grid>
                </Box>

                {songs.length > 0 && <UserPlaylistTable type="songs" data={songs} columns={song_columns} />}

            </header >
        </div >
    );
}

export default Dashboard;