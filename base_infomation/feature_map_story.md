# Đặc tả Feature — Chat Map Mode

## 1. Mục tiêu

Chat Map Mode là một chế độ mở rộng trong **conversation 1-1** của chat app.

Khi người dùng chuyển từ Chat Mode sang Map Mode, hệ thống hiển thị bản đồ. Map chỉ hoạt động khi hai người đồng ý chia sẻ vị trí với nhau.

Feature này không tạo conversation mới và không thay đổi luồng nhắn tin hiện tại.

---

## 2. Luồng chia sẻ vị trí

Trong conversation, User A có thể gửi yêu cầu chia sẻ vị trí cho User B.

A chọn thời gian chia sẻ:

* 1 giờ
* 2 giờ

Thời gian tối đa là **2 giờ**.

User B có thể:

* Accept
* Reject

Sau khi B accept, hệ thống kiểm tra trạng thái location của cả hai.

Session chỉ bắt đầu khi:

* A có location hợp lệ
* B có location hợp lệ

Khi đủ điều kiện:

```text
PENDING
→ ACTIVE
```

Thời gian share được tính từ lúc session thực sự bắt đầu.

Ví dụ:

```text
10:00 A gửi request 2 giờ
10:05 B accept
10:06 cả hai có location

started_at = 10:06
expires_at = 12:06
```

Một trong hai người cũng có thể chủ động dừng chia sẻ trước thời hạn.

---

## 3. Realtime Location

Trong thời gian session ACTIVE, vị trí của hai người được cập nhật realtime trên bản đồ.

Luồng chính:

```text
GPS
→ Client
→ WebSocket
→ Backend
→ Redis
→ WebSocket
→ User còn lại
```

Realtime location **không lưu lịch sử vào MySQL**.

Redis chỉ giữ vị trí gần nhất của từng user:

```text
map:session:{sessionId}:location:{userId}
```

Dữ liệu ví dụ:

```json
{
  "lat": 10.762622,
  "lng": 106.660172,
  "accuracy": 8.2,
  "updatedAt": "..."
}
```

Khi user di chuyển, marker của user trên map di chuyển theo.

Nếu user tắt GPS hoặc mất location giữa session, session vẫn tiếp tục nhưng phía còn lại sẽ thấy trạng thái location không còn cập nhật.

---

## 4. Map Moment

Trong session ACTIVE, mỗi người có thể upload hình ảnh gọi là **Moment**.

Khi upload, backend lấy vị trí realtime hiện tại của user và gắn vị trí đó vào Moment.

Moment được cố định tại vị trí upload.

Ví dụ:

```text
User A upload ảnh tại Location X
→ Moment nằm tại X

A tiếp tục di chuyển tới Y
→ marker A di chuyển tới Y
→ Moment vẫn nằm tại X
```

Client không được tự gửi một tọa độ tùy ý để tạo Moment. Backend phải sử dụng location gần nhất đang lưu trong realtime session.

Moment tồn tại trên map tối đa:

```text
30 phút
```

Nhưng không được tồn tại lâu hơn session.

Do đó:

```text
visible_until =
MIN(
    created_at + 30 phút,
    session.expires_at
)
```

---

## 5. Nhóm Moment trong bán kính 5 mét

Các Moment nằm trong cùng khu vực bán kính khoảng **5 mét** sẽ được gom lại thành một marker.

Ví dụ có 5 ảnh:

```text
    ●
   +5
```

Khi người dùng nhấn marker:

```text
Ảnh 1
← swipe →
Ảnh 2
← swipe →
Ảnh 3
...
```

Tương tự cách xem Story.

Việc grouping không cần lưu thành bảng riêng trong database. Đây là dữ liệu có thể tính từ các Moment hiện tại.

---

## 6. Notification

Khi một người upload Moment, người còn lại phải nhận được notification realtime.

Ví dụ:

```text
Phi vừa đăng một khoảnh khắc trên bản đồ.
```

Các event chính của Map Mode có thể gồm:

```text
map.share.requested
map.share.accepted
map.share.rejected

map.session.started
map.session.ended
map.session.expired

map.location.updated

map.moment.created
map.moment.expired

notification.created
```

Map event phải tách khỏi event message hiện tại để tránh ảnh hưởng module chat.

---

## 7. Storage

Hiện tại storage provider là:

```text
Google Drive
```

Nhưng Map Mode không được gọi Google Drive API trực tiếp từ business service.

Kiến trúc:

```text
MapMomentService
        ↓
StorageService
        ↓
StorageProvider
        ↓
GoogleDriveProvider
```

Nhờ vậy sau này có thể thay Google Drive bằng:

```text
S3
Azure Blob
Google Cloud Storage
...
```

mà không phải sửa logic của Map Mode.

---

## 8. Phân loại file trên Storage

File phải được phân biệt theo feature để tránh lẫn với attachment chat hoặc các loại media khác.

Trong database sử dụng:

```text
purpose
```

Ví dụ:

```text
MESSAGE_ATTACHMENT
MAP_MOMENT
AVATAR
```

Google Drive cũng nên tổ chức folder theo feature:

```text
Dove/
└── production/
    ├── chat/
    │   └── attachments/
    │
    ├── map/
    │   └── moments/
    │       └── conversation-{id}/
    │           └── session-{id}/
    │
    └── avatar/
```

Tên file nên dùng UUID thay vì filename gốc của user.

---

## 9. Hết thời gian chia sẻ

Khi:

```text
NOW >= session.expires_at
```

session chuyển thành:

```text
EXPIRED
```

Backend phải thực hiện:

```text
1. Stop realtime location

2. Xóa location của session khỏi Redis

3. Không cho upload thêm Moment

4. Moment không còn hiển thị

5. Xóa toàn bộ file Moment của session khỏi Google Drive

6. Cập nhật trạng thái storage asset

7. Gửi event session expired tới client
```

Cleanup phải do backend worker thực hiện.

Không phụ thuộc vào frontend vì user có thể:

* đóng browser
* tắt app
* mất mạng
* không còn mở Map Mode

---

## 10. Xử lý lỗi khi xóa Storage

Không được xóa record database trước rồi mới xóa Google Drive.

Quy trình:

```text
ACTIVE
→ DELETE_PENDING
→ gọi Google Drive delete
```

Nếu thành công:

```text
DELETED
```

Nếu lỗi:

```text
DELETE_FAILED
```

Worker có thể retry sau.

Việc này đảm bảo không bị mất `provider_file_id` của file chưa xóa được.

---

## 11. Database

Map Mode sử dụng các bảng riêng:

```text
map_share_sessions
map_session_members
map_moments
map_moment_media
```

Các module dùng chung:

```text
storage_assets
notifications
```

Quan hệ chính:

```text
conversation
      │
      ▼
map_share_session
      │
      ├── map_session_members
      │
      └── map_moments
              │
              ▼
       map_moment_media
              │
              ▼
       storage_assets
```

Realtime location không nằm trong MySQL mà sử dụng Redis.

Các bảng chat hiện tại như `messages`, `message_attachments`, `message_deliveries` không được thay đổi trong phase này.

---

## 12. API chính

REST API dự kiến:

```text
POST /conversations/:conversationId/map-share-requests

POST /map-sessions/:sessionId/accept
POST /map-sessions/:sessionId/reject
POST /map-sessions/:sessionId/end

GET  /conversations/:conversationId/map-session
GET  /map-sessions/:sessionId/state
GET  /map-sessions/:sessionId/moments

POST /map-sessions/:sessionId/moments
```

Location realtime sử dụng WebSocket thay vì gọi REST liên tục.

---

## 13. Điều kiện upload Moment

Backend chỉ cho phép upload khi:

```text
user authenticated

AND user thuộc conversation

AND user thuộc map session

AND session.status = ACTIVE

AND current_time < expires_at

AND realtime location tồn tại

AND location chưa stale
```

Location nên đủ mới, ví dụ:

```text
updated_at <= 15 giây trước
```

Nếu location đã quá cũ, backend từ chối tạo Moment và yêu cầu client cập nhật location trước.

---

## 14. Nguyên tắc triển khai

Agent triển khai feature này phải tuân thủ:

```text
Không refactor module chat đang hoạt động nếu không cần thiết.

Không thay đổi schema messages/message_attachments ở phase này.

Map Mode là module riêng.

Realtime location dùng Redis.

MySQL chỉ lưu business state và Moment.

Google Drive được truy cập thông qua StorageService.

Tất cả authorization phải kiểm tra lại ở backend.

Client không được quyết định session expiry hoặc tọa độ Moment.

Cleanup phải idempotent và chạy phía server.
```

Mục tiêu là thêm Chat Map Mode vào hệ thống hiện tại với phạm vi thay đổi nhỏ nhất, tránh làm ảnh hưởng các chức năng chat đã deploy.




src/
├── chat/
│   ├── conversation/
│   ├── message/
│   │
│   └── map/
│       └── map-story/
│           ├── controllers/
│           │   ├── map-story-session.controller
│           │   └── map-story-moment.controller
│           │
│           ├── services/
│           │   ├── map-story-session.service
│           │   ├── map-story-location.service
│           │   └── map-story-moment.service
│           │
│           ├── repositories/
│           │   ├── map-story-session.repository
│           │   └── map-story-moment.repository
│           │
│           ├── gateways/
│           │   └── map-story.gateway
│           │
│           ├── jobs/
│           │   └── map-story-cleanup.job
│           │
│           ├── dto/
│           ├── entities/
│           ├── enums/
│           └── types/
│

