// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from 'phoenix';

var user = "aaa";

let socket = new Socket('/socket', { params: { token: window.userToken } });
socket.connect();

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel('rooms:lobby', {});
channel
    .join()
    .receive('ok', resp => {
        console.log('Joined successfully', resp);
    })
    .receive('error', resp => {
        console.log('Unable to join', resp);
    });

// canvas描画処理
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var box = document.getElementById('canvasBox');

canvas.width = box.clientWidth * 0.9;
canvas.height = window.innerHeight / 2;

var oldPos = {x: '', y: ''};

var defaultAlpha = 1.0;
var defaultSize = 4;
var color = ((Math.random() * 0xffffff) | 0).toString(16);
var defaultColor = '#' + ('000000' + color).slice(-6);
var drawing = false;

canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mousedown', onClick, false);
canvas.addEventListener('mouseup', drawEnd, false);
canvas.addEventListener('mouseout', drawEnd, false);

channel.on('change', msg => {
    var oldPosObj = JSON.parse(msg.oldPos);
    var posObj = JSON.parse(msg.pos);
    draw(msg.user, oldPosObj, posObj, msg.color);
});

function getPos(e) {
    var rect = e.target.getBoundingClientRect();
    var mouseX = ~~(e.clientX - rect.left);
    var mouseY = ~~(e.clientY - rect.top);
    return {x: mouseX, y: mouseY};
}

function onClick(e) {
    drawing = true;
    oldPos = getPos(e);
    var oldPosStr = JSON.stringify(oldPos);
    channel.push('change', { user: user, oldPos: oldPosStr, pos: oldPosStr, color: defaultColor });
}

function onMove(e) {
    var pos = getPos(e);
    if (drawing === true) {
        draw(user, oldPos, pos, defaultColor);
        var oldPosStr = JSON.stringify(oldPos);
        var posStr = JSON.stringify(pos);
        channel.push('change', { user: user, oldPos: oldPosStr, pos: posStr, color: defaultColor });
        oldPos = pos;
    }
}

function drawEnd(e) {
    drawing = false;
}

function draw(user, oldPos, pos, color) {
    ctx.beginPath();
    ctx.globalAlpha = defaultAlpha;
    ctx.lineCap = 'round';
    ctx.lineWidth = defaultSize * 2;
    ctx.strokeStyle = color;
    ctx.moveTo(oldPos.x, oldPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.closePath();
}

channel.on('change', function(dt) {});

export default socket;
