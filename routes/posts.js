const router = require("express").Router();
const { authenticate } = require("../middleware/authenticate");
const Post = require("../models/post");
const validate = require("validate.js");
const dataValidation = require("../middleware/dataValidation");

// Fetch all posts
router.get("/", authenticate, async (req, res, next) => {
  console.log("postsController fetchAllPosts");

  try {
    const posts = await Post.find().populate("publisher", "-password -tokens");

    res.status(200).send({ posts: posts });
  } catch (err) {
    next(err);
  }
});

// Post a new post in db
router.post("/", authenticate, async (req, res, next) => {
  console.log("postsController createPost");

  const post = new Post(req.body);

  {
    if (!post.postText) {
      next({ code: 400, message: "postText is missing" }); // Quality - check for missing field  x
    }
  }

  post.publisher = req.user._id;

  try {
    dataValidation.objectDoesNotContainFunctions(post); // Security - check for callable function in new job
    await post.save();
    res.status(200).send();
  } catch (err) {
    next(err);
  }
});
router.post("/:postId/comment", authenticate, async function(req, res, next) {
  console.log("postsController createComment", req.params);

  // Security - picks only relevant fields
  const { newComment } = req.body;

  // Quality - check for missing field
  {
    if (!newComment.comment) {
      next({ code: 400, message: "comment is missing" });
    }
    if (!req.params.postId) {
      next({ code: 400, message: "itemId is missing" });
    }
  }

  newComment.itemId = req.params.postId;
  newComment._id = new ObjectId();
  newComment.date = new Date();
  newComment.user = req._id;

  try {
    // Security - check for callable function in new comment
    dataValidation.objectDoesNotContainFunctions(newComment);

    await CommentsCollection.insertOne(newComment);

    await PostsCollection.updateOne(
      {
        _id: ObjectId(req.params.postId)
      },
      { $push: { comments: newComment._id } }
    );

    res.status(200).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
