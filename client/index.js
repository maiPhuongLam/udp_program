const express = require("express");
const bodyParser = require("body-parser");
const dgram = require("dgram");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
const socket = dgram.createSocket("udp4");

app.use(bodyParser.json());

let udpResponse = null;

const udpPort = 4000;
socket.bind(udpPort, () => {
  console.log(`UDP socket bound to port ${udpPort}`);
});

app.get("/", (req, res) => {
  const pathFile = path.join(__dirname, "/public/index.html");
  fs.readFile(pathFile, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });

    res.end(data);
  });
});

app.post("/send", async (req, res) => {
  const { number } = req.body;
  if (!isNaN(number)) {
    udpResponse = res;
    socket.send(Buffer.from(number), process.env.PORT, process.env.IP);
  } else {
    console.log("Đầu vào không hợp lệ. Hãy nhập lại");
  }
});

socket.on("message", (msg, rinfo) => {
  console.log("Tổng nhận được từ server: " + msg);
  if (udpResponse) {
    udpResponse.status(200).json({ number: parseInt(msg) });
    udpResponse = null;
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
