const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email_id: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        }
    },
    {
        tableName: 'users',
        timestamps: { createdAt: true, updatedAt: true }
    }
);

module.exports = mongoose.model("users", userSchema);