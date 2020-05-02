export const createPost = post => {
  return {
    type: "REQUEST_CREATE_POST",
    route: "posts",
    method: "POST",
    payload: post
  };
};

export const fetchPosts = () => {
  return {
    type: "REQUEST_POSTS",
    route: "posts",
    method: "GET"
  };
};

export const createComment = (postId, comment) => {
  return {
    type: "REQUEST_CREATE_COMMENT",
    route: "posts/${postId}/comment/",
    method: "POST",
    payload: { comment }
  };
};
