const http = require("http");
const https = require("https");
const config = require("./config.js");
const nodemailer

const server = http.createServer(function (request, response) {
    console.log(request.param);

    if (request.method == "POST") {
        console.log("POST");
        var body = "";
        request.on("data", function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        request.on("end", function () {
            console.log("Body: " + body);
            //fetch(`https://api.ip2location.io/?key=${config.locationApi}&ip=${request.headers["x-forwarded-for"] || request.socket.remoteAddress}&format=json`).then((res) => {
            //    console.dir(res);
            //});
            https
                .get(`https://api.ip2location.io/?key=${config.locationApi}&ip=${request.headers["x-forwarded-for"] || request.socket.remoteAddress}&format=json`, (resp) => {
                    let data = "";
                    resp.on("data", (chunk) => {
                        data += chunk;
                    });

                    resp.on("end", () => {
                        let info = JSON.parse(data);
                        if (info) {
                            
                        }
                        response.writeHead(200, { "Content-Type": "text/plain" });
                        response.end("post received");
                    });
                })
                .on("error", (err) => {
                    console.log("Error: " + err.message);
                });
        });
    } else {
        console.log("GET");
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("Hi!");
    }
});

server.listen();
