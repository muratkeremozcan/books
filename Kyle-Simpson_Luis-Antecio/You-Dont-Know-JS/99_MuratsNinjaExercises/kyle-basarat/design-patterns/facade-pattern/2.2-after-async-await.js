import axios from "axios";
import _ from "lodash";
import R from "ramda";

// makes refactoring easy
async function getFetch(url, params = {}) {
  const res = await axios({
    method: "GET",
    url,
    params,
  });

  return res.data;
}

const getUsers = () => getFetch("https://jsonplaceholder.typicode.com/users");

const getUserPosts = (userId) =>
  getFetch("https://jsonplaceholder.typicode.com/posts", { userId });

/////////
{
  const users = await getUsers();

  users.map(async (user) => {
    const posts = await getUserPosts(user.id);
    return `${user.name}:${posts.length}`;
  });
  // same
  _.map(users, async (user) => {
    const posts = await getUserPosts(user.id);
    return `${user.name}:${posts.length}`;
  });
  // same
  R.map(async (user) => {
    const posts = await getUserPosts(user.id);
    return `${user.name}:${posts.length}`;
  }, users);
}
/////////

const fetchRandomUserPosts = async () => {
  const users = await getUsers();

  return new Promise((resolve) =>
    users.map(async (user) => {
      const posts = await getUserPosts(user.id);
      resolve(`${user.name}:${posts.length}`);
    })
  );
};

fetchRandomUserPosts();
fetchRandomUserPosts();
fetchRandomUserPosts();

/////////////////////

const fetchAllUserPosts = async () => {
  const users = await getUsers();
  return Promise.all(
    users.map(async (user) => {
      const posts = await getUserPosts(user.id);
      return `${user.name}:${posts.length}`;
    })
  );
};

fetchAllUserPosts();

//////

const getUser = (id) =>
  getFetch("https://jsonplaceholder.typicode.com/users", { id });

const fetchUserPost = async (userId, postId) => {
  const [user] = await getUser(userId);
  const posts = await getUserPosts(user.id);

  const [postN] = posts.filter((post) => post.id === postId); //?
  return `${user.name} post: ${postN.title}`;
};

fetchUserPost(1, 5); //?
