const VoteModel = require("./model");
const PollModel = require("../poll/model");

const setUserVote = async (req, res) => {
  const { vote, isVote, pollId } = req.body;
  const anonymousId = req.anonymousId;

  // checking user is already given vote
  const isUserAlreadyVoted = await VoteModel.findOne({ pollId, anonymousId });

  // already vote with same vote
  if (isUserAlreadyVoted.optionText === vote && isVote) {
    return res.json({ message: "Already voted with same option" });
  }

  const poll = await PollModel.findOne({ pollId });

  // user want to restore its vote
  if (isUserAlreadyVoted.optionText === vote && !isVote) {
    // decrease the vote count with prev option
    const { options, totalVotes, ...restPoll } = poll;
    const updatedOptions = options.map((option) => {
      if (option.text === vote) {
        return {
          ...option.text,
          voteCount: option.voteCount - 1,
        };
      }
    });
    const updatedPoll = {
      ...restPoll,
      options: updatedOptions,
      totalVotes: totalVotes - 1,
    };

    // send to kafka topic to update the poll Topic "UpdateDbAndLeaderBoard" with Partition "PollId" also on Topic "VoteTopic" with partition "PollId"

    return res.json({ messsage: "Vote Successfully :)" });
  }

  if (isUserAlreadyVoted) {
    // changing the vote with new option and pushed into kafka Topic "VoteTopic" And Partition "PollId" to update the vote later

    const updatedPoll = updatePollVotes(poll, prevVote, (newVote = vote));
    // send the updated Poll to kafka

    // sending to other Kafka Topic "ChangeVote" And Partition "PollId" for update the Poll by decreasing the previous vote count and increaing new vote count
    const changeVote = {
      pollId,
      anonymousId,
      prevVote: isUserAlreadyVoted.optionText,
      newVote: vote,
    };
    // sendin to producer "ChangeVote"
  }
};

function updatePollVotes(poll, prevVote, newVote) {
  const { options, ...restPoll } = poll;
  const updateOptions = options.map((option) => {
    if (option.text === prevVote) {
      return {
        ...option.text,
        voteCount: option.voteCount - 1,
      };
    }
    if (option.text === newVote) {
      return {
        ...option.text,
        voteCount: option.voteCount + 1,
      };
    }
  });
  const totalVotes = updatedOptions.reduce((acc, option) => {
    total += option.voteCount;
    return total;
  }, total);

  return {
    ...restPoll,
    options: updateOptions,
    totalVotes,
  };
}

module.exports = {
  setUserVote,
};

/*
const setUserVote = async (req, res) => {
  const { vote, isVote, pollId, anonymousId } = req.body;

  // 1. Check if the user has already voted
  const isUserAlreadyVoted = await VoteModel.findOne({ pollId, anonymousId });

  const poll = await PollModel.findOne({ pollId });

  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }

  const { options, totalVotes } = poll;

  // 2. User tries to vote on the same option again
  if (isUserAlreadyVoted && isUserAlreadyVoted.optionText === vote && isVote) {
    return res.json({ message: "Already voted with the same option" });
  }

  // 3. User removes/deselects their vote
  if (isUserAlreadyVoted && isUserAlreadyVoted.optionText === vote && !isVote) {
    const updatedOptions = options.map((option) =>
      option.text === vote
        ? { ...option, voteCount: option.voteCount - 1 }
        : option
    );

    const updatedPoll = {
      ...poll,
      options: updatedOptions,
      totalVotes: totalVotes - 1,
    };

    // Update poll in the database (simulate Kafka update)
    await PollModel.updateOne({ pollId }, updatedPoll);
    await VoteModel.deleteOne({ pollId, anonymousId });

    return res.json({ message: "Vote removed successfully" });
  }

  // 4. User votes on a new option (or same option after removal)
  if (!isUserAlreadyVoted || (isUserAlreadyVoted && isUserAlreadyVoted.optionText !== vote)) {
    const updatedOptions = options.map((option) =>
      option.text === vote
        ? { ...option, voteCount: option.voteCount + 1 }
        : option
    );

    const updatedPoll = {
      ...poll,
      options: updatedOptions,
      totalVotes: totalVotes + 1,
    };

    // Update poll in the database (simulate Kafka update)
    await PollModel.updateOne({ pollId }, updatedPoll);

    // Create or update the user's vote
    if (isUserAlreadyVoted) {
      await VoteModel.updateOne({ pollId, anonymousId }, { optionText: vote });
    } else {
      await VoteModel.create({ pollId, anonymousId, optionText: vote });
    }

    return res.json({ message: "Vote successfully cast" });
  }

  return res.status(400).json({ message: "Invalid vote action" });
};

*/
