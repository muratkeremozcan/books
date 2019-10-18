'use strict';
// Pagination middleware. This middleware grabs the value assigned to ?page=N, fetches the total number of results and exposes the page object with pre-computed values to any views that may later be rendered
module.exports = (cb, perpage) => {
  perpage = perpage || 10; // defaults to 10 per page
  return (req, res, next) => { // returns middleware function
    let page = Math.max(parseInt(req.params.page || '1', 10), 1) - 1; // parse page param as a base 10 integer
    cb((err, total) => { //  invoke the function passed
      if (err) return next(err); // delegate errors
      req.page = res.locals.page = { //stores page properties for future reference
        number: page,
        perpage: perpage,
        from: page * perpage,
        to: page * perpage + perpage - 1,
        total: total,
        count: Math.ceil(total / perpage)
      };
      next(); // passes control to the next middleware component
    });
  };
};

