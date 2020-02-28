//--------------------------------------------------
//  Bi-Directional OSC messaging Websocket <-> UDP
//--------------------------------------------------
var osc = require("osc"),
    WebSocket = require("ws");

const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../Medias');

var getIPAddresses = function () {
    var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

    for (var deviceName in interfaces){
        var addresses = interfaces[deviceName];

        for (var i = 0; i < addresses.length; i++)
        {
            var addressInfo = addresses[i];

            if (addressInfo.family === "IPv4" && !addressInfo.internal)
            {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

fs.readdir(directoryPath, function (err, files)
{
    if (err)
    {
        return console.log('Unable to scan directory: ' + err);
    } 

    var fileList = "var PlayList = [";

    files.forEach(function (file)
    {
        console.log(file); 
        fileList += "\"" + file + "\",";
    });

    fileList = fileList.slice(0, fileList.length - 1);

    fileList += "];";

    fs.writeFile('web/playlist.js', fileList, function (err)
    {
	  if (err) throw err;
	  console.log('Playlist generated');
	});
});

var udp = new osc.UDPPort(
{
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort: 7500
});

udp.on("ready", function ()
{
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");

    ipAddresses.forEach(function (address)
    {
        console.log(" Host:", address + ", Port:", udp.options.localPort);
    });

    console.log("Broadcasting OSC over UDP to", udp.options.remoteAddress + ", Port:", udp.options.remotePort);
});

udp.on("message", function (oscMsg, timeTag, info)
{
    udp.options.remoteAddress = info.address;
});

udp.open();

var wss = new WebSocket.Server(
{
    port: 8081
});

wss.on("connection", function (socket)
{
    console.log("Connected");

    var socketPort = new osc.WebSocketPort(
    {
        socket: socket
    });

    var relay = new osc.Relay(udp, socketPort, 
    {
        raw: true
    });
});
