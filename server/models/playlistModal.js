const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        }
    },
    {
        tableName: 'playlists',
        timestamps: { createdAt: true, updatedAt: true }
    }
);

module.exports = mongoose.model("playlists", playlistSchema);