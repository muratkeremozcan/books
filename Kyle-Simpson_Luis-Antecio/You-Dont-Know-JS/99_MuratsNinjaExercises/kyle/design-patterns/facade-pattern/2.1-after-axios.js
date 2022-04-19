import axios from "axios";

// makes refactoring easy
function getFetch(url, params = {}) {
  return axios({
    method: "GET",
    url,
    params,
  }).then((res) => res.data);
}

const getUsers = () => getFetch("https://jsonplaceholder.typicode.com/users");

const getUserPosts = (userId) =>
  getFetch("https://jsonplaceholder.typicode.com/posts", { userId });

/////////////
{
  getUsers().then((users) =>
    users.map((user) =>
      getUserPosts(user.id).then((posts) => `${user.name}:${posts.length}`)
    )
  );
}
/////////////

const fetchRandomUserPosts = () =>
  getUsers().then(
    (users) =>
      new Promise((resolve) =>
        users.map((user) =>
          getUserPosts(user.id).then((posts) =>
            resolve(`${user.name}:${posts.length}`)
          )
        )
      )
  );

fetchRandomUserPosts(); //?
fetchRandomUserPosts(); //?
fetchRandomUserPosts(); //?

///////////////

const fetchAllUserPosts = () =>
  getUsers().then((users) =>
    Promise.all(
      users.map((user) =>
        getUserPosts(user.id).then((posts) => `${user.name}:${posts.length}`)
      )
    )
  );

fetchAllUserPosts(); /*?+*/
