

## Chốt kiến trúc Video Call của Dove

```text
                         Dove
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Chat                     Video / Audio
             │                           │
        Socket.IO                    WebRTC
             │                           │
       NestJS signaling              P2P
             │                           │
       ┌─────┴─────┐              ┌─────┴─────┐
       │           │              │           │
     User A      User B         Camera      Mic
```

### 1. Socket.IO

**Không truyền video/audio.**

Chỉ dùng cho signaling:

```text
call:start
call:accept
call:reject
call:end
webrtc:offer
webrtc:answer
webrtc:ice-candidate
```

Và trạng thái:

```text
ringing
accepted
connected
ended
rejected
```

---

### 2. WebRTC

Browser tự xử lý:

```text
Camera
Microphone
    ↓
getUserMedia()
    ↓
RTCPeerConnection
    ↓
WebRTC
    ↓
User còn lại
```

Audio và video đi trực tiếp giữa hai browser khi có thể.

---

### 3. STUN

Dùng STUN để giúp hai client tìm đường kết nối P2P.

```text
User A ─────── User B
   │              │
   └── STUN ──────┘
```

---

### 4. TURN

Đây là phần **nên có** nếu muốn hệ thống thực tế ổn định hơn.

Nếu A và B không thể P2P:

```text
User A
   │
   ▼
 TURN Server
   │
   ▼
User B
```

Ta có thể **self-host coturn**, không trả phí dịch vụ.

---

## Flow hoàn chỉnh

### A gọi B

```text
A click Video Call
        ↓
Socket.IO
        ↓
NestJS
        ↓
B nhận incoming call
        ↓
B Accept
        ↓
A tạo WebRTC Offer
        ↓
Socket.IO → B
        ↓
B tạo Answer
        ↓
Socket.IO → A
        ↓
ICE Candidates trao đổi
        ↓
WebRTC connection
        ↓
🎥 Video
🎤 Audio
```

---

# Những chức năng Phase 1

Mình sẽ chỉ làm **1-to-1** trước:

```text
📹 Video call
🎤 Audio call
🔇 Mute / unmute
📷 Camera on / off
📞 Accept
❌ Reject
☎ End call
```

Có thể thêm:

```text
🔄 Reconnect
📶 Connection state
```

---

# Không làm ngay

Chưa cần:

```text
❌ Group call
❌ Recording
❌ Screen recording
❌ SFU
❌ Media server
❌ LiveKit
❌ Jitsi
❌ Agora
❌ Twilio
```

Nếu sau này Dove cần 5–10+ người trong một cuộc gọi thì lúc đó mới đánh giá **SFU**. Không cần tự trói mình vào architecture đó ngay từ đầu.

---

# Infrastructure

Server hiện tại:

```text
Ubuntu
│
├── Nginx
├── Next.js
├── NestJS
├── MySQL
├── Redis
└── coturn        ← thêm khi làm video call
```

Nginx:

```text
HTTPS :443
   │
   ├── Next.js
   ├── NestJS API
   └── Socket.IO
```

WebRTC media:

```text
Browser ←──────────────→ Browser
              │
         nếu P2P fail
              ↓
           coturn
```

Và **HTTPS là bắt buộc** cho camera/microphone trên web, nên phần Certbot mà mình đã chuẩn bị cho server Dove sẽ rất cần ở feature này.

---

## Chốt công nghệ

```text
Frontend
Next.js
    +
WebRTC APIs

Backend
NestJS
    +
Socket.IO

Database
MySQL

Realtime infrastructure
Redis

NAT traversal
STUN
    +
coturn/TURN

Reverse proxy
Nginx

Process manager
PM2

HTTPS
Let's Encrypt / Certbot
```

Đây là hướng **đơn giản, không phụ thuộc vendor và không mất phí dịch vụ video**. Chi phí thực tế chủ yếu là server + bandwidth TURN nếu có nhiều cuộc gọi.

Và quan trọng: **không cần đụng vào kiến trúc chat hiện tại**. Ta chỉ thêm một `Call`/`WebRTC` layer vào Dove.


/////////////////////////////////

Có. **Đây mới là cách nên thiết kế** cho web.

Ta không cần đảm bảo browser chạy nền 24/7. Ta chỉ cần đảm bảo:

> **Mỗi khi user quay lại app, hệ thống lấy được trạng thái location hiện tại từ server ngay lập tức, rồi tiếp tục lấy GPS mới.**

### Flow sẽ là

```text
User A đang share
        │
        ▼
Browser A
GPS → Socket → Server
        │
        ▼
Server lưu current location
```

Giả sử A đi tới:

```text
10.1234, 105.1234
```

Server giữ:

```json
{
  "userId": 1,
  "lat": 10.1234,
  "lng": 105.1234,
  "accuracy": 8,
  "updatedAt": "...",
  "expiresAt": "..."
}
```

Sau đó A **đóng browser**.

GPS ngừng cập nhật — **đúng như bạn nói**.

Nhưng server vẫn biết:

```text
lastKnownLocation
```

---

# Khi A mở lại browser

Ví dụ 20 phút sau:

```text
Open browser
      ↓
Login
      ↓
connect Socket.IO
      ↓
check active location session
      ↓
GET current location
      ↓
server trả lastKnownLocation
      ↓
📍 hiển thị ngay
      ↓
navigator.geolocation.watchPosition()
      ↓
GPS lấy vị trí mới
      ↓
Socket update
```

Nên user **không phải chờ GPS update đầu tiên mới thấy map**.

Ví dụ:

```text
14:00
A = 📍 vị trí 1

14:15
A đóng browser

14:30
A mở lại

Server:
A = 📍 vị trí 1

UI:
ngay lập tức hiện 📍 vị trí 1

sau đó GPS:
A = 📍 vị trí 2

UI:
📍 → 📍 vị trí 2
```

---

# Nhưng có một điểm rất quan trọng

Mình sẽ phân biệt:

### `lastKnownLocation`

và

### `currentLocation`

Ví dụ server:

```json
{
  "lat": 10.1234,
  "lng": 105.1234,
  "accuracy": 12,
  "updatedAt": "14:15:32"
}
```

Khi A quay lại lúc 14:30, UI phải biết:

> Đây là vị trí **cuối cùng server biết được**, không phải chắc chắn vị trí hiện tại.

Nên có thể hiển thị:

```text
📍 A
Vị trí cập nhật 15 phút trước
```

Sau khi browser lấy GPS mới:

```text
📍 A
Đang cập nhật
```

---

# Và B cũng nhận được trạng thái ngay

Đây mới là phần hay.

Giả sử:

```text
A đang share
B đang mở Chat Map
```

A đóng browser.

B vẫn thấy:

```text
A 📍
Last update: 14:15
```

Sau đó A mở lại app:

```text
A browser
   ↓
Socket reconnect
   ↓
server
   ↓
A gửi location mới
   ↓
B nhận
   ↓
marker di chuyển
```

Không cần B reload.

---

# Socket.IO rất hợp cho chuyện này

Khi socket reconnect:

```text
Client
  ↓
connect
  ↓
authenticate
  ↓
join conversation room
  ↓
server gửi active location session
  ↓
server gửi last-known locations
```

Ví dụ event:

```text
location:session-state
```

server gửi:

```json
{
  "sessionId": 123,
  "expiresAt": "2026-08-20T15:00:00Z",
  "members": [
    {
      "userId": 1,
      "lat": 10.1234,
      "lng": 105.1234,
      "accuracy": 8,
      "updatedAt": "2026-08-20T14:15:32Z"
    },
    {
      "userId": 2,
      "lat": 10.1255,
      "lng": 105.1266,
      "accuracy": 12,
      "updatedAt": "2026-08-20T14:29:01Z"
    }
  ]
}
```

Frontend chỉ cần:

```text
setLocations(members)
```

là map có trạng thái ngay.

---

# Nhưng server phải biết session còn sống

Ví dụ:

```text
Session:
14:00 → 16:00
```

A đóng browser lúc:

```text
14:30
```

thì session **không được kết thúc**.

Nó vẫn:

```text
ACTIVE
expiresAt = 16:00
```

Chỉ có:

```text
A không gửi GPS
```

mà thôi.

Đến:

```text
16:00
```

server mới:

```text
ACTIVE
   ↓
EXPIRED
```

và broadcast:

```text
location:session-expired
```

cho cả hai.

---

# Khi user quay lại sau khi session hết hạn

Ví dụ:

```text
Share: 14:00 → 16:00

A đóng browser: 14:30

A mở lại: 17:00
```

Server:

```text
session expired
```

=> **không được bật GPS lại**.

UI phải hiện:

```text
Location sharing ended
```

và yêu cầu tạo session mới nếu muốn share tiếp.

---

# Còn nếu user mở lại trước khi hết hạn

Ví dụ:

```text
14:00 start
16:00 expire

14:30 đóng
15:10 mở
```

thì:

```text
active session
       ↓
15:10 connect
       ↓
get lastKnownLocation
       ↓
show marker
       ↓
watchPosition
       ↓
continue sharing
```

**Hoàn toàn được.**

---

## Vì vậy kiến trúc cuối cùng nên là

```text
                  DATABASE
                     │
              Share Session
              startedAt
              expiresAt
                     │
                     │
                   REDIS
                     │
              Last Known GPS
                     │
          ┌──────────┴──────────┐
          │                     │
       Browser A             Browser B
          │                     │
   watchPosition()        watchPosition()
          │                     │
          └────── Socket.IO ────┘
```

Browser có thể biến mất bất kỳ lúc nào:

```text
Browser OFF
     ↓
GPS OFF
     ↓
Server vẫn giữ lastKnownLocation
     ↓
Browser ON
     ↓
Socket reconnect
     ↓
lastKnownLocation → UI ngay
     ↓
GPS mới → realtime tiếp tục
```

### Đây là điểm mình nghĩ rất quan trọng cho Dove

**Realtime không nên được định nghĩa là "server luôn biết GPS của user".**

Mà là:

> **Server luôn biết trạng thái cuối cùng hợp lệ của location session; khi client online thì location được cập nhật realtime.**

Cách này vừa phù hợp với giới hạn của web, vừa cho UX mà bạn muốn. Và với Socket.IO + NestJS hiện tại của Dove thì **không cần thêm một hệ thống realtime khác**.

