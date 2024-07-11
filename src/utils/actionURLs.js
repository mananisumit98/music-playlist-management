// const API_URL = "http://localhost:8000";
const API_URL = "https://music-system-server.vercel.app";
const USER_LOGIN = `${API_URL}/user/login`;
const USER_REGISTRATION = `${API_URL}/user/register`;
const NEW_PLAYLIST = `${API_URL}/playlist/create`;
const GET_PLAYLIST = `${API_URL}/playlist/all/:id`;
const UPDATE_PLAYLIST = `${API_URL}/playlist/update`;
const DELETE_PLAYLIST = `${API_URL}/playlist/delete/:id`;
const ADD_SONGS = `${API_URL}/songs/create`;
const FETCH_SONGS = `${API_URL}/songs/all/:id`;
const DELETE_SONG = `${API_URL}/songs/delete/:id`;

module.exports = {
    API_URL, USER_LOGIN, USER_REGISTRATION, NEW_PLAYLIST, GET_PLAYLIST, UPDATE_PLAYLIST, DELETE_PLAYLIST, ADD_SONGS, FETCH_SONGS, DELETE_SONG
}