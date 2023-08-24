const { exec } = require('child_process');
const NodeMediaServer = require('node-media-server');
const applicationTitle = ''

// Start capturing and encoding video
let captureCommand = `ffmpeg -f gdigrab -i title=${applicationTitle} -vcodec libx264 -tune zerolatency -preset ultrafast -crf 23 -f flv rtmp://localhost/live/streamKey`;

const isNotWin = process.platform != "win32"

if (isNotWin) {
    captureCommand = `ffmpeg -f x11grab -draw_mouse 1 -r 30 -i :0.0 -vcodec libx264 -tune zerolatency -preset ultrafast -crf 23 -f flv rtmp://localhost/live/streamKey`    
}

const ffmpegProcess = exec(captureCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Video captured successfully.`);
});

// Create a NodeMediaServer instance
const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30,
    },
    http: {
        port: 8000,
        allow_origin: '*',
    },
};

const nms = new NodeMediaServer(config);

nms.run();

// Handle cleanup
// process.on('exit', () => {
//   ffmpegProcess.kill();
//   nms.stop();
// });
