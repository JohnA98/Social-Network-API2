const { User, Thought } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughtsData = await Thought.find();
      res.status(200).json(thoughtsData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId});
      console.log(thoughtData);
      res.status(200).json(thoughtData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);

      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Thought created but no user with this id!" });
      }

      res.json({ message: "Thought successfully created!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  

  //update a thought
  // updateThought(req, res) {
  //   Thought.findOneAndUpdate(
  //     { _id: req.params.thoughtId },
  //     { $set: req.body },
  //     { runValidators: true, New: true }
  //   )
  //     .then((user) =>
  //       !user
  //         ? res.status(404).json({ message: "No thought find with this ID!" })
  //         : res.json(user)
  //     )
  //     .catch((error) => res.status(500).json(error));
  // },

  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res
          .status(404)
          .json({ message: "No thought found with this ID!" });
      }

      return res.json(updatedThought);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // delete a thought
  // deleteThought(req, res) {
  //   Thought.findOneAndDelete({ _id: req.params.thoughtId })
  //     .then((thought) =>
  //       !thought
  //         ? res.status(404).json({ message: "No thought find with this ID!" })
  //         : User.findOneAndUpdate(
  //             { thoughts: req.params.thoughtId },
  //             { $pull: { thoughts: req.params.thoughtId } },
  //             { new: true }
  //           )
  //     )
  //     .then((user) =>
  //       !user
  //         ? res
  //             .status(404)
  //             .json({ message: "Thought deleted, but no user found" })
  //         : res.json({ message: "Thought successfully deleted" })
  //     )
  //     .catch((error) => res.status(500).json(error));
  // },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with this ID!" });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "Thought deleted, but no user found" });
      }

      return res.json({ message: "Thought successfully deleted" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with this ID!" });
      }
      return res.json(thought);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with this ID!" });
      }

      return res.json(thought);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};


