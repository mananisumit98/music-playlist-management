const mongoose = require("mongoose");

const songsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        album: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        images: [
            {
                type: String
            }
        ],
        song_id: {
            type: String,
            required: true
        },
        playlist_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "playlists",
            required: true,
        }
    },
    {
        tableName: 'songs',
        timestamps: { createdAt: true, updatedAt: true }
    }
);

module.exports = mongoose.model("songs", songsSchema);