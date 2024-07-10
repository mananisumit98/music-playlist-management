// Import Models
const Songs = require("../models/songsModal");

const { CATCH_ERROR, SONG_NOT_ADDED, SONG_ADDED, DUPLICATE_SONG, NO_DATA, SONGS_SUCCESS, SONGS_DELETED } = require('../locale/messages');

const newSong = async (req, res) => {
    console.log("controller@songs/newSong");
    try {
        const { name, album, artist, images, playlist_id, song_id } = req.body;

        const checkDuplicate = await Songs.find({ playlist_id: playlist_id, song_id: song_id });

        if (checkDuplicate.length) {
            return res.json({ message: DUPLICATE_SONG, success: false });
        }

        const insertSong = await Songs.create({
            name: name,
            album: album,
            artist: artist,
            images: images,
            playlist_id: playlist_id,
            song_id: song_id
        });

        if (!insertSong) {
            return res.json({ message: SONG_NOT_ADDED, success: false });
        }

        return res.json({ message: SONG_ADDED, success: true, data: insertSong });
    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }
}
const getSongsById = async (req, res) => {
    console.log("controller@songs/getSongsById");
    try {
        const { id } = req.params;

        const getSongs = await Songs.find({ playlist_id: id });

        if (!getSongs.length) {
            return res.json({ message: NO_DATA, success: false });
        }

        return res.json({ message: SONGS_SUCCESS, success: true, data: getSongs });
    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }
}
const deleteSong = async (req, res) => {
    console.log("controller@songs/deleteSong");
    try {
        const { id } = req.params;
        await Songs.deleteMany({ _id: id });
        return res.json({ message: SONGS_DELETED, success: true });
    } catch (error) {
        return res.json({ message: CATCH_ERROR, success: false, error: error.message });
    }
}

module.exports = { newSong, getSongsById, deleteSong };