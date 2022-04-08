import fetch from "node-fetch";

// facade pattern is just a functional refactor...
function getFetch(url, params = {}) {
  const qs = Object.entries(params)
    .map((param) => `${param[0]}=${param[1]}`)
    .join("&");

  return fetch(`${url}?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

const getUsers = () => getFetch("https://jsonplaceholder.typicode.com/users");

const getUserPosts = (userId) =>
  getFetch("https://jsonplaceholder.typicode.com/posts", { userId });

getUsers().then((users) =>
  users.map(
    (user) =>
      getUserPosts(user.id).then((posts) => `${user.name}:${posts.length}`) //?
  )
);
