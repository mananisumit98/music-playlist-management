const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const authTokenSchema = new mongoose.Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        token: { type: String, required: true },
    },
    {
        tableName: 'auth_tokens',
        timestamps: { createdAt: true, updatedAt: true }
    }
);

const authToken = mongoose.model('auth_tokens', authTokenSchema)

module.exports = authToken;