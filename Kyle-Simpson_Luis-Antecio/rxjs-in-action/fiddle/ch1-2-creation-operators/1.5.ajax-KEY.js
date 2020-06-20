import { ajax } from 'rxjs/ajax';

// Create an observable for an Ajax request with either a string for a URL
// or a request object with url, headers, etc

// signature: ajax(urlOrRequest: string | AjaxRequest)


const githubUsers = `https://api.github.com/users?per_page=2`;

// string example:
const usersUrl$ = ajax(githubUsers);

usersUrl$.subscribe(
  res => console.log(res),
  err => console.error(err)
);


// if you want to get only the json response, use ajax.getJSON
const usersUrlJson$ = ajax.getJSON(githubUsers);

usersUrlJson$.subscribe(
  res => console.log(res),
  err => console.error(err)
);


// request object example
const usersRequest$ = ajax({
  url: githubUsers,
  method: "GET",
  headers: { "Access-Control-Allow-Origin": "*" },
  body: { /* some body */ }
})

usersRequest$.subscribe(
  res => console.log(res.response), // if you add the .response, it acts like getJSON
  err => console.error(err)
);


// there is CORS with node. You can work around it using express.
// or just repro this at https://stackblitz.com/edit/rxjs-vqnnot