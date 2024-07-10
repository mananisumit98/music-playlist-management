const router = require("express").Router();
const { newPlaylist, updatePlaylist, getPlaylistsById, deletePlaylist } = require("../controllers/playlists");

router.get("/all/:id", getPlaylistsById);
router.post("/create", newPlaylist);
router.patch("/update", updatePlaylist);
router.delete("/delete/:id", deletePlaylist);

module.exports = router;