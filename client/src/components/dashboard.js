import { useEffect, useRef, useState } from "react"
import axios from 'axios';
import { toast } from '../utils/constants';
import { useForm } from "react-hook-form";
import { Box, Grid, IconButton, TextField } from "@mui/material";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { EditSharp, DeleteForeverSharp, RemoveRedEyeSharp } from "@mui/icons-material";
import { DELETE_PLAYLIST, GET_PLAYLIST, NEW_PLAYLIST, UPDATE_PLAYLIST } from "../utils/actionURLs";
import UserPlaylistTable from "./playListTable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PLAYLIST, SEARCH } from "../utils/routes";

const Dashboard = () => {

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const userDetails = JSON.parse(localStorage.getItem("user"));
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        fetchPlayList();
    }, []);

    const onSubmit = async (data) => {
        try {

            const formData = {
                name: data.playlist_name,
                user_id: userDetails?._id
            }

            let response;

            if (isUpdate && updateId) {
                // Update playlist
                delete formData.user_id;
                formData.id = updateId;
                response = await axios.patch(UPDATE_PLAYLIST, formData);
            } else {
                // Create new playlist
                response = await axios.post(NEW_PLAYLIST, formData);
            }

            console.log("response ::::", response.data);
            if (response.data.success) {
                refresh();
                toast(response.data.message, "success");
            } else {
                reset();
                toast(response.data.message, "error");
            }
        } catch (error) {
            reset();
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }
    const fetchPlayList = async (data) => {
        try {

            let url = GET_PLAYLIST.replace(":id", userDetails?._id);

            const response = await axios.get(url);

            if (response.data.success) {
                reset();
                setPlaylist(response.data.data);
            } else {
                setPlaylist([]);
            }
        } catch (error) {
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }

    const refresh = () => {
        fetchPlayList();
        setIsUpdate(false);
        setUpdateId(null);
        setValue("playlist_name", "");
    }

    const handleAdd = (row, action) => {
        if (action === "update") {
            updatePlaylist(row);
        } else if (action === "delete") {
            deletePlaylist(row);
        } else if(action === "view") {
            navigate(PLAYLIST.replace(":id", row._id));
        }
    }

    const updatePlaylist = async (row) => {
        console.log("row: ", row);
        setIsUpdate(true);
        setUpdateId(row._id);
        inputRef.current.focus();
        setValue("playlist_name", row.name);
    }
    const deletePlaylist = async (row) => {
        try {

            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this playlist?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let url = DELETE_PLAYLIST.replace(":id", row._id);

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
                        setPlaylist([]);
                    }

                }
            });

        } catch (error) {
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }

    const playlist_columns = [
        {
            field: "name",
            headerName: "Playlist Name",
            flex: 1,
            minWidth: 300,
            valueFormatter: (params) => {
                if (params) {
                    return params
                }
                return "-";
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 300,
            renderCell: (params) => (
                <div>
                    <IconButton
                        onClick={() => handleAdd(params.row, "update")}
                        title="Generate feedback"
                    >
                        <EditSharp className="action-icon" color="info" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleAdd(params.row, "delete")}
                        title="Generate feedback"
                    >
                        <DeleteForeverSharp className="action-icon" color="error" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleAdd(params.row, "view")}
                        title="Generate feedback"
                    >
                        <RemoveRedEyeSharp className="action-icon" color="success" />
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
                        <TextField
                            required
                            fullWidth
                            inputRef={inputRef}
                            id="playlist"
                            label="New Playlist"
                            name="playlist"
                            autoComplete="email"
                            {...register("playlist_name", {
                                required: 'Playlist name is required.'
                            })}
                        />
                        <Typography component="h1" variant="h5">
                            {errors?.playlist_name?.type === 'required' && <span className="errormsg">{errors.playlist_name.message}</span>}
                        </Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isUpdate ? "Update Playlist" : "Create Playlist"}
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={() => navigate(SEARCH)}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            Search Songs
                        </Button>
                    </Grid>
                </Box>

                {playlist.length > 0 && <UserPlaylistTable type="playlist" data={playlist} columns={playlist_columns} />}

            </header >
        </div >
    );
}

export default Dashboard;