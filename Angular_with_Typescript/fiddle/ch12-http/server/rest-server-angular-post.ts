import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import { AddressInfo } from "net";

// [3] nkode app that handles post requests

const app = express();

app.use(bodyParser.json()); // (3.1) use bodyparser is to parse the POST data coming in, and it's turned to json here

// (3.2) create an endpoint to handle post requests (body and price are coming from the UI's POST form value object {title: "1", price: "3"})
app.post("/api/product", (req, res) => {
    console.log(`Received new product ${req.body.title} ${req.body.price}`);
    // (3.3) send confirmation message back
    res.json( // to simulate an error, make the response not to be json
        {
            'message': `Server responded: added ${req.body.title} with price: $${req.body.price}`
        }
    );
});

const server = app.listen(4201, "localhost", () => {
    const { address, port } = server.address() as AddressInfo;
    console.log(`Listening on ${address}: ${port}`);
});

// to run the server:  node build/rest-server-angular-post