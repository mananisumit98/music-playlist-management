// Import Models
const Playlist = require("../models/playlistModal");
const Songs = require("../models/songsModal");

const { CATCH_ERROR, PLAYLIST_EXISTS, PLAYLIST_NOT_CREATED, PLAYLIST_CREATED, PLAYLIST_UPDATED, PLAYLIST_SUCCESS, NO_DATA, PLAYLIST_DELETED } = require('../locale/messages');

const newPlaylist = async (req, res) => {
    console.log("controller@playlist/newPlaylist");
    try {
        const { name, user_id } = req.body;

        const playlist = await Playlist.findOne({ user_id: user_id, name: name });

        if (playlist) {
            return res.json({ message: PLAYLIST_EXISTS, success: false, playlist: playlist });
        }

        const createPlayList = await Playlist.create({
            user_id: user_id,
            name: name
        });

        if (!createPlayList) {
            return res.json({ message: PLAYLIST_NOT_CREATED, success: false });
        }

        return res.json({ message: PLAYLIST_CREATED, success: true, data: createPlayList });
    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }
}

const updatePlaylist = async (req, res) => {
    console.log("controller@playlist/updatePlaylist");
    try {

        const { id, name } = req.body;

        const updatePlaylist = await Playlist.updateOne({ _id: id }, { name: name }, { new: true });

        return res.json({ message: PLAYLIST_UPDATED, success: true, data: updatePlaylist });

    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }

}
const deletePlaylist = async (req, res) => {
    console.log("controller@playlist/deletePlaylist");
    try {

        const { id } = req.params;
        await Playlist.deleteMany({ _id: id });
        await Songs.deleteMany({ playlist_id: id });
        return res.json({ message: PLAYLIST_DELETED, success: true });

    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }

}
const getPlaylistsById = async (req, res) => {
    console.log("controller@playlist/getPlaylistsById");
    try {

        const { id } = req.params;

        const fetchPlaylist = await Playlist.find({ user_id: id });

        if (!fetchPlaylist) {
            return res.json({ message: NO_DATA, success: false });
        }

        return res.json({ message: PLAYLIST_SUCCESS, success: true, data: fetchPlaylist });

    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }

}

module.exports = { newPlaylist, updatePlaylist, deletePlaylist, getPlaylistsById };