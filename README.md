# 💬 ỨNG DỤNG CHAT 1-1 REALTIME - WEBSOCKET

## 📋 GIỚI THIỆU

Ứng dụng Chat 1-1 Realtime được xây dựng theo đúng cấu trúc tài liệu tham khảo, sử dụng:
- **Backend**: Node.js + Express + WebSocket (ws) thuần
- **Frontend**: HTML + CSS + JavaScript thuần (không dùng framework)
- **Lưu trữ**: RAM (không dùng database)
- **Giao thức**: WebSocket nguyên thủy (KHÔNG dùng Socket.IO)

## 🎯 TÍNH NĂNG

### ✅ Đã triển khai đầy đủ:
- ✔️ Đăng ký userId khi kết nối
- ✔️ Chat 1-1 realtime giữa 2 người dùng cụ thể
- ✔️ Ghép cặp người dùng theo recipientId
- ✔️ Gửi/nhận tin nhắn thời gian thực
- ✔️ Hiển thị tin nhắn 2 chiều (trái/phải)
- ✔️ Thông báo khi đối phương rời khỏi
- ✔️ Xử lý các trường hợp lỗi:
  - UserId đã tồn tại
  - Người nhận chưa online
  - Người nhận đang chat với người khác
  - Mất kết nối

### 🔧 Các sự kiện WebSocket:
1. **REGISTER** - Đăng ký userId
2. **REQUEST_CHAT** - Yêu cầu chat với recipientId
3. **CHAT_READY** - Thông báo sẵn sàng chat
4. **SEND_MESSAGE** - Gửi tin nhắn
5. **FORWARD_MESSAGE** - Forward tin nhắn tới recipient
6. **LEFT** - Thông báo người dùng rời đi
7. **ERROR** - Thông báo lỗi
8. **RECIPIENT_NOT_ONLINE** - Người nhận chưa online


