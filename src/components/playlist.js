import { useEffect, useState } from "react"
import axios from 'axios';
import { toast } from '../utils/constants';
import { Box, IconButton } from "@mui/material";
import Typography from '@mui/material/Typography';
import { DeleteForeverSharp, RemoveRedEyeSharp, CloseOutlined } from "@mui/icons-material";
import { FETCH_SONGS, DELETE_SONG } from "../utils/actionURLs";
import UserPlaylistTable from "./playListTable";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import { Modal } from "@mui/base";

/*
 - In the playlist component, the user can see the list of songs that where added into the individual playlist.
 - The user can see the details of the songs in the Modal Popup by clicking in the view button
 - The user can also delete the song from the playlist.
 - The user can navigate to playlist or searching songs directly using navigation bar on the top of the component. 
*/

// Style component fix the position of the Modal Popup
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Dashboard = () => {

    // Used to fetch playlist ID from the Route
    const params = useParams();
    const { id: playlist_id } = params;

    const [songs, setSongs] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState([]);

    useEffect(() => {
        fetchSongs();
    }, []);

    // Songs are fetched using playlistID and displayed into the Datatable.
    const fetchSongs = async (data) => {
        try {

            let url = FETCH_SONGS.replace(":id", playlist_id);

            const response = await axios.get(url);

            if (response.data.success) {
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

    // HandleAdd function will work conditionally to view or delete the song.
    const handleAdd = async (row, action) => {
        if (action === "view") {
            setOpen(true);
            setCurrentRow(row);
            return;
        } else if (action === "delete") {
            deleteSong(row);
        }

    }

    const handleClose = () => {
        setOpen(false);
        setCurrentRow([]);

    }

    const deleteSong = (row) => {
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

                    if (response.data.success) {
                        refresh();
                        Swal.fire({
                            title: response.data.message,
                            text: "The song is deleted from the playlist.",
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

    // Songs are displayed in the Datatable
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
                        onClick={() => handleAdd(params.row, "view")}
                        title="View details"
                    >
                        <RemoveRedEyeSharp className="action-icon" color="success" />
                    </IconButton>
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

                <Navigation from="song" />

                {songs.length > 0 ?
                    <UserPlaylistTable
                        type="songs"
                        data={songs}
                        columns={song_columns}
                    /> :
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h5" component="h2" color="GrayText">
                            Please add songs in the playlist
                        </Typography>
                    </Box>
                }

                {/* Modal to shoe song details in the popup */}
                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="h2">
                                {currentRow.name}
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                        <Typography sx={{ mt: 2 }}>
                            Album: {currentRow.album}
                        </Typography>
                        <Typography>
                            Artist: {currentRow.artist}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                            {currentRow.images?.map((image, index) => (
                                <Box key={index} sx={{ flex: '1 0 21%', m: 1 }}>
                                    <img src={image} alt={`${currentRow.album} ${index}`} style={{ width: '100%', borderRadius: '8px' }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Modal>

            </header >
        </div >
    );
}

export default Dashboard;