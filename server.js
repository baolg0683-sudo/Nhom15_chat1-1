const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const PORT = 8080; // Cổng này phải khớp với WS_URL trong useChat.ts

// Tạo HTTP server
const server = http.createServer(app);

// Tạo WebSocket server gắn vào HTTP server
const wss = new WebSocket.Server({ server });

// Lưu trữ danh sách người dùng online
// Cấu trúc: Map<userId, { ws: WebSocket, pairedWith: string | null }>
const clients = new Map();

// Hàm tiện ích gửi tin nhắn JSON an toàn
const sendJSON = (ws, payload) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
    }
};

wss.on('connection', (ws) => {
    console.log('Client mới đã kết nối socket');
    
    // Biến lưu userId của kết nối này để xử lý khi ngắt kết nối
    let myUserId = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            const { type, userId, recipientId, text } = data;

            console.log(`Nhận lệnh: ${type} từ ${userId || 'Ẩn danh'}`);

            switch (type) {
                // 1. Xử lý Đăng ký (Khớp với hooks/useChat.ts dòng 124)
                case 'REGISTER':
                    if (!userId || clients.has(userId)) {
                        sendJSON(ws, { type: 'ERROR', text: 'ID không hợp lệ hoặc đã tồn tại.' });
                        return;
                    }
                    
                    myUserId = userId;
                    clients.set(userId, { ws, pairedWith: null });
                    
                    // Phản hồi về FE để chuyển sang màn hình LOBBY
                    sendJSON(ws, { type: 'REGISTERED', userId: userId });
                    console.log(`User [${userId}] đã đăng ký.`);
                    break;

                // 2. Xử lý Yêu cầu Chat (Khớp với hooks/useChat.ts dòng 135)
                case 'REQUEST_CHAT':
                    if (!myUserId) return;

                    // Kiểm tra người nhận có online không
                    const partner = clients.get(recipientId);

                    if (!partner) {
                        sendJSON(ws, { 
                            type: 'RECIPIENT_NOT_ONLINE', 
                            text: `Người dùng ${recipientId} hiện không trực tuyến.` 
                        });
                        return;
                    }

                    // Kiểm tra người nhận có đang bận không
                    if (partner.pairedWith) {
                        sendJSON(ws, { 
                            type: 'ERROR', 
                            text: `Người dùng ${recipientId} đang trò chuyện với người khác.` 
                        });
                        return;
                    }

                    if (myUserId === recipientId) {
                        sendJSON(ws, { type: 'ERROR', text: 'Không thể chat với chính mình.' });
                        return;
                    }

                    // --- GHÉP CẶP THÀNH CÔNG ---
                    // Cập nhật trạng thái ghép cặp cho cả 2
                    clients.get(myUserId).pairedWith = recipientId;
                    partner.pairedWith = myUserId;

                    // Gửi thông báo CHAT_READY cho người gửi (FE chuyển sang màn hình CHAT)
                    sendJSON(ws, { 
                        type: 'CHAT_READY', 
                        pairedWith: recipientId 
                    });

                    // Gửi thông báo CHAT_READY cho người nhận (FE chuyển sang màn hình CHAT)
                    sendJSON(partner.ws, { 
                        type: 'CHAT_READY', 
                        pairedWith: myUserId 
                    });

                    console.log(`Đã ghép cặp: ${myUserId} <-> ${recipientId}`);
                    break;

                // 3. Xử lý Gửi tin nhắn (Khớp với hooks/useChat.ts dòng 139)
                case 'SEND_MESSAGE':
                    if (!myUserId) return;

                    const sender = clients.get(myUserId);
                    if (!sender || !sender.pairedWith) {
                        sendJSON(ws, { type: 'ERROR', text: 'Bạn chưa kết nối với ai.' });
                        return;
                    }

                    const receiverId = sender.pairedWith;
                    const receiver = clients.get(receiverId);

                    if (receiver) {
                        // Chuyển tiếp tin nhắn sang người nhận
                        // FE mong đợi type: 'FORWARD_MESSAGE' (types.ts dòng 14)
                        sendJSON(receiver.ws, {
                            type: 'FORWARD_MESSAGE',
                            from: myUserId,
                            text: text,
                            timestamp: Date.now()
                        });
                    } else {
                        // Trường hợp hy hữu: Partner mất kết nối đột ngột
                        sendJSON(ws, { type: 'LEFT', userId: receiverId });
                        sender.pairedWith = null;
                    }
                    break;
            }

        } catch (e) {
            console.error('Lỗi xử lý tin nhắn:', e);
        }
    });

    // 4. Xử lý ngắt kết nối (F5, tắt tab)
    ws.on('close', () => {
        if (myUserId && clients.has(myUserId)) {
            const me = clients.get(myUserId);
            
            // Nếu đang chat với ai đó, báo cho họ biết
            if (me.pairedWith) {
                const partnerId = me.pairedWith;
                const partner = clients.get(partnerId);
                
                if (partner) {
                    // Gửi sự kiện LEFT (Khớp useChat.ts dòng 88)
                    sendJSON(partner.ws, { 
                        type: 'LEFT', 
                        userId: myUserId 
                    });
                    partner.pairedWith = null; // Reset trạng thái người ở lại
                }
            }
            
            clients.delete(myUserId);
            console.log(`User [${myUserId}] đã ngắt kết nối.`);
        }
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`WebSocket sẵn sàng tại ws://localhost:${PORT}`);
});