const mongoose = require('mongoose');

const matchSchema = mongoose.Schema(
    {
        user1: {
            type: String,
            required: true,
            ref: 'User' 
        },
        user2: {
            type: String,
            required: true,
            ref: 'User' 
        }
    },
    {
        timestamps: true,
    }
)

matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
