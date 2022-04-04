// We’re used to seeing if statements like this
{
  const hasAccess = true;

  if (hasAccess) {
    console.log("Access granted.");
  } else {
    console.log("Access denied");
  }
}

// An increasingly popular alternative is the ternary statement
{
  const hasAccess = true;

  hasAccess ? "Access granted" : "Access denied"; //?
}

// Ramda provides ifElse, letting you handle branching logic with functions
{
  const { ifElse } = require("ramda");
  const hasAccess = true;

  const logAccess = ifElse(
    () => hasAccess,
    () => "Access granted",
    () => "Access denied"
  );

  logAccess(); //?
}

// One advantage is that you can package the logic away into a function
// Instead of hard coding the hasAccess variable, make it a parameter
{
  const { ifElse } = require("ramda");

  const logAccess = ifElse(
    (hasAccess) => hasAccess,
    () => "Access granted",
    () => "Access denied"
  );

  logAccess(true);
  logAccess(false);
}

{
  const { ifElse } = require("ramda");

  const logAccess = () =>
    Promise.resolve(true).then((foo) =>
      ifElse(
        (f) => resolve(f),
        () => "Access granted",
        () => "Access denied"
      )
    );

  logAccess(true);
  logAccess(false);

  Promise.resolve("foo").then((foo) => foo);
}

// This makes a point-free style easier to achieve
{
  const { always, equals, ifElse } = require("ramda");

  const logAccess = ifElse(
    equals(true),
    always("Access granted"),
    always("Access denied")
  );

  logAccess(true);
  logAccess(false);
}
