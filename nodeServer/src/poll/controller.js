const PollModel = require("./model");

const createPoll = async (req, res) => {
  try {
    const { title, options } = req.body;
    let createdBy;
    if (req.anonymousId) {
      createdBy = req.anonymousId;
    }

    if (createdBy === undefined) {
      createdBy = "";
    }

    const poll = new PollModel({
      createdBy: createdBy,
      title,
      options,
    });
    const savedPoll = await poll.save();

    return res.json({
      message: "Poll created successfully",
      poll: savedPoll,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

const getPolls = async (req, res) => {
  /*
    TODO: 
    - first get the anonymousId from req body
    - Then get the created poll with latest date and active status
    - Then search for the anonymousId in vote that use is already given some votes or not from voteModel
    - Then modify the poll response by adding the isVoted: true votedOption: "" for handling on the frontend
    */
  const { page = 1, limit = 10, pollStatus = "active" } = req.query;
  const anonymousId = req.anonymousId;
  let userVotes = [];
  if (anonymousId) {
    // const votes =
    console.log(anonymousId);
  }

  const skip = (page - 1) * limit;

  const polls = await PollModel.find({ pollStatus })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return res.json({ message: "Getting polls", polls });
};

module.exports = {
  createPoll,
  getPolls,
};
