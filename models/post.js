const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    trim: true,
    default: "employmentType"
  },
  tags: [],
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  publishedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  comments: [
    {
      commentText: {
        type: String,
        required: true,
        default: "Yo B"
      },
      publisher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      publishedAt: {
        type: Date,
        required: true,
        default: Date.now
      }
    }
  ]
});

postSchema.methods.toJSON = function() {
  const post = this;
  const postObject = post.toObject();

  return postObject;
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
