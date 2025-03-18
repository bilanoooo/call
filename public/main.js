 const peer = new Peer(undefined, {
            host: 'call-r3ol.onrender.com', // استبدل بعنوان URL الخاص بك على Render
            port: 443, // Render يستخدم HTTPS على المنفذ 443
            path: '/peerjs',
            secure: true, // Render يستخدم HTTPS
        });

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
