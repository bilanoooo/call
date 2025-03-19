const peer = new Peer(undefined, {
    host: 'call-production-b4a4.up.railway.app', // استبدل بعنوان السيرفر الفعلي
    port: 443,
    path: '/peerjs',
    secure: true,
    config: {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
                urls: "turn:your-turn-server.com:3478",
                username: "user",
                credential: "password"
            }
        ]
    }
});

// عرض معرف المستخدم عند الاتصال
peer.on('open', (id) => {
    document.getElementById('peer-id').textContent = id;
});

// طلب إذن الوصول إلى الكاميرا والمايكروفون
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = stream;
        localVideo.play();

        // إجراء مكالمة
        document.getElementById('call-btn').addEventListener('click', () => {
            const remotePeerId = document.getElementById('remote-id').value;
            if (!remotePeerId) return alert("يرجى إدخال معرف المستخدم الآخر!");
            
            const call = peer.call(remotePeerId, stream);
            call.on('stream', remoteStream => {
                const remoteVideo = document.getElementById('remote-video');
                remoteVideo.srcObject = remoteStream;
                remoteVideo.play();
            });
        });

        // استقبال المكالمات
        peer.on('call', call => {
            call.answer(stream);
            call.on('stream', remoteStream => {
                const remoteVideo = document.getElementById('remote-video');
                remoteVideo.srcObject = remoteStream;
                remoteVideo.play();
            });
        });
    })
    .catch(err => console.error('❌ خطأ في الوصول إلى الوسائط:', err));
