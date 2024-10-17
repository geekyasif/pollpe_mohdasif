const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: false,
    default: "",
  },
  anonymousToken: {
    type: String,
    required: true,
  },
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: true,
  },
  optionText: {
    type: String,
    required: true,
  },
  isVoted: {
    type: Boolean,
    default: true,
  },
  voteDate: {
    type: Date,
    default: Date.now,
  },
});

voteSchema.index({ pollId: 1 });
voteSchema.index({ userId: 1 }, { unique: true });
voteSchema.index({ anonymousToken: 1 }, { unique: true });
voteSchema.index({ userId: 1, pollId: 1 }, { unique: true });
voteSchema.index({ anonymousToken: 1, pollId: 1 }, { unique: true });

module.exports = mongoose.Model("Vote", voteSchema);
