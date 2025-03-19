const peer = new Peer(undefined, {
    host: 'call-production-b4a4.up.railway.app',
    port: 443,
    path: '/peerjs',
    secure: true,
    config: {
        'iceServers': [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            // يمكنك إضافة خوادم TURN هنا إذا كانت STUN غير كافية
            // { 
            //     urls: 'turn:your-turn-server.com:443',
            //     username: 'username',
            //     credential: 'credential'
            // }
        ]
    },
    debug: 3
});

// 2. تحسين إدارة الأخطاء والتشخيص
peer.on('open', (id) => {
    console.log('تم الاتصال بخادم PeerJS بنجاح. معرف الاتصال:', id);
    document.getElementById('peer-id').textContent = id;
    document.getElementById('connection-status').textContent = 'متصل بالخادم';
});

peer.on('error', (err) => {
    console.error('خطأ في الاتصال:', err);
    document.getElementById('connection-status').textContent = 'خطأ: ' + err.type;
    
    // محاولة إعادة الاتصال
    if (err.type === 'network' || err.type === 'server-error') {
        setTimeout(() => {
            console.log('محاولة إعادة الاتصال...');
            peer.reconnect();
        }, 5000);
    }
});

peer.on('disconnected', () => {
    console.log('انقطع الاتصال بالخادم');
    document.getElementById('connection-status').textContent = 'غير متصل';
    
    // محاولة إعادة الاتصال
    setTimeout(() => {
        console.log('محاولة إعادة الاتصال...');
        peer.reconnect();
    }, 3000);
});

// 3. تحسين التعامل مع وسائط الاتصال
let localStream;

async function setupMedia() {
    try {
        // طلب الصلاحيات بوضوح
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }, 
            audio: true 
        });
        
        localStream = stream;
        const video = document.getElementById('local-video');
        video.srcObject = stream;
        video.play();
        
        setupCallHandlers();
        
        document.getElementById('media-status').textContent = 'تم الحصول على الصوت والفيديو';
    } catch (err) {
        console.error('خطأ في الوصول إلى وسائط الجهاز:', err);
        document.getElementById('media-status').textContent = 'خطأ في الوصول إلى الكاميرا/الميكروفون: ' + err.message;
    }
}

// 4. تحسين إدارة الاتصال
function setupCallHandlers() {
    document.getElementById('call-btn').addEventListener('click', () => {
        const remotePeerId = document.getElementById('remote-id').value;
        if (!remotePeerId) {
            alert('الرجاء إدخال معرف الطرف الآخر');
            return;
        }
        
        document.getElementById('call-status').textContent = 'جاري الاتصال...';
        
        const call = peer.call(remotePeerId, localStream);
        handleCall(call);
    });
    
    peer.on('call', call => {
        document.getElementById('call-status').textContent = 'جاري الرد على الإتصال...';
        call.answer(localStream);
        handleCall(call);
    });
}

function handleCall(call) {
    call.on('stream', remoteStream => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
        document.getElementById('call-status').textContent = 'متصل';
    });
    
    call.on('error', err => {
        console.error('خطأ في الاتصال:', err);
        document.getElementById('call-status').textContent = 'خطأ في الاتصال: ' + err;
    });
    
    call.on('close', () => {
        document.getElementById('call-status').textContent = 'انتهى الاتصال';
    });
}

// 5. بدء التطبيق
document.addEventListener('DOMContentLoaded', () => {
    setupMedia();
});
