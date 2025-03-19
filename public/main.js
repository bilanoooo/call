const peer = new Peer(undefined, {
    host: 'call-production-b4a4.up.railway.app', 
    port: 443, 
    path: '/peerjs',
    secure: true, 
    config: {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }, // سيرفر STUN مجاني من جوجل
            { 
                urls: "turn:your-turn-server.com:3478", 
                username: "user", 
                credential: "password" 
            } // استبدل بمعلومات سيرفر TURN الخاص بك إذا لزم الأمر
        ]
    }
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
