var res = [];

// problem: the responses happen concurrently and may arrive in any order
// function response(data) {
//   res.push( data );
// }

// solution: coordinate response order with conditional check
function response(data) {
    if (data.url == "http://some.url.1") {
        res[0] = data;
    }
    else if (data.url == "http://some.url.2") {
        res[1] = data;
    }
}
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
