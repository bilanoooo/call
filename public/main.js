const peer = new Peer(undefined, { host: '/', port: 3000, path: '/peerjs' });

peer.on('open', (id) => {
    document.getElementById('peer-id').textContent = id;
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        const video = document.getElementById('local-video');
        video.srcObject = stream;
        video.play();

        document.getElementById('call-btn').addEventListener('click', () => {
            const remotePeerId = document.getElementById('remote-id').value;
            const call = peer.call(remotePeerId, stream);
            call.on('stream', remoteStream => {
                const remoteVideo = document.getElementById('remote-video');
                remoteVideo.srcObject = remoteStream;
                remoteVideo.play();
            });
        });

        peer.on('call', call => {
            call.answer(stream);
            call.on('stream', remoteStream => {
                const remoteVideo = document.getElementById('remote-video');
                remoteVideo.srcObject = remoteStream;
                remoteVideo.play();
            });
        });
    })
    .catch(err => console.error('Error accessing media devices.', err));
