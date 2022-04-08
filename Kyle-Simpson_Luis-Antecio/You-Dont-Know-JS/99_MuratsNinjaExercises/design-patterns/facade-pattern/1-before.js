import fetch from "node-fetch";

function getUsers() {
  return fetch("https://jsonplaceholder.typicode.com/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

function getUserPosts(userId) {
  return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

getUsers().then((users) =>
  users.map(
    (user) =>
      getUserPosts(user.id).then((posts) => `${user.name}:${posts.length}`) //?
  )
);
