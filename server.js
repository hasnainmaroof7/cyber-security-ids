const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("web"));

function randomIP() {
    return "192.168.1." + Math.floor(Math.random() * 5 + 1);
}

io.on("connection", (socket) => {
    console.log("Client connected");

    setInterval(() => {

        let packet = {
            src: randomIP(),
            dest: randomIP()
        };

        socket.emit("traffic", packet);

        if (packet.src === "192.168.1.5") {
            socket.emit("alert", {
                node: packet.src,
                severity: "HIGH",
                type: "SUSPICIOUS ACTIVITY"
            });
        }

    }, 2000);
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});