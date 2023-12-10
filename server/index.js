const dgram = require("dgram");
require("dotenv").config();
const server = dgram.createSocket("udp4");

const sum = (total, input) => {
  return (total += input);
};

let total = 0;
server.on("message", function (msg, rinfo) {
  console.log("Số nhận được từ client: " + msg);
  total = sum(total, parseInt(msg));

  console.log(`tổng là: ${total}`);
  if (!isNaN(total)) {
    server.send(JSON.stringify(total), process.env.PORT, process.env.IP);
  }
});

server.bind(8080);
