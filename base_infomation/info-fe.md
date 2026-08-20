Mình sẽ quét frontend theo cùng cách: xác định stack và entrypoint trước, sau đó lần theo layout, routing/state, HTTP/socket services và từng feature module để mô tả frontend đang làm gì, dữ liệu đi đâu, cùng các điểm còn dang dở. Mình chỉ đọc và tổng hợp, không sửa source.

Map frontend architecture

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read memory 

Read 

Read 

Searched for files matching `dove` · `frontend/src/**/*.{ts,tsx}`, 120 matches

Searched for regex `axios|http\.|socket|makeAutoObservable|observable|action|BrowserRouter|Routes|Route|navigate\(|localStorage|sessionStorage` (`**/frontend/src/**/*.{ts,tsx}`), 211 results

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Searched for regex `@(?:Get|Post|Put|Patch|Delete)\(|@Controller\(|@SubscribeMessage\(|@WebSocketGateway\(` (`**/backend/src/**/*.ts`), 35 results

Searched for regex `fetch\(|http\.(get|post|put|patch|delete)|/api/|/auth/|/users/|/friends/|/topics|/messages|/conversations` (`**/frontend/src/**/*.{ts,tsx}`), 36 results

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read , lines 1 to 180

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Checked , no problems found

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read , lines 1 to 180

Frontend là React 18 + TypeScript + Vite, có hai lớp UI lớn: chat và bản đồ, với MobX làm state và Axios/Socket.IO làm transport. Entry hiện chỉ route `/` và `/login`, còn phần auto-refresh auth chạy ngay khi app mount; mình đang lần sâu vào các store/service và layout để mô tả chính xác trạng thái đăng nhập, chọn conversation/topic, gửi message và map interaction.

Searched for files matching `dove` · `frontend/src/**/*.{ts,tsx}`, 120 matches

Searched for regex `createBrowserRouter|BrowserRouter|Routes|Route|axios|socket|io\(|makeAutoObservable|observable|action|@observer|observer\(|localStorage|sessionStorage|refresh|login|conversation|topic|message` (`**/frontend/src/**/*.{ts,tsx}`), 572 results

Read 

Read 

Read 

Read 

Read 

Các contract chính đã hiện ra: Axios tự gắn Bearer và tự refresh khi 401; chat socket dùng namespace `/chat`; MobX giữ auth/user/chat/topic/friend/presence. Mình đang đối chiếu trực tiếp các component điều phối và service domain để phân biệt chức năng đang chạy thật với các scaffold/prototype còn chưa nối vào UI.

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

Read 

# Frontend đang làm gì

Frontend là một **SPA chat realtime**, hiện tập trung vào các chức năng:

- Đăng nhập và tự refresh session.
- Hiển thị danh sách conversation.
- Chọn conversation và topic.
- Đọc/gửi message.
- Nhận message realtime qua Socket.IO.
- Tạo topic.
- Tìm user và gửi lời mời kết bạn.
- Hiển thị bản đồ trong chat.
- Hiển thị user presence trên bản đồ.
- Chia sẻ một điểm focus trên map.
- Hỗ trợ giao diện desktop và mobile.

Entry point là `main.tsx`. Root component và routing nằm ở `App.tsx`.

# Stack kỹ thuật

Theo `package.json`:

- UI framework: React 18
- Language: TypeScript
- Build tool: Vite 7
- Routing: React Router DOM 7
- State management: MobX 6
- React binding cho MobX: `mobx-react-lite`
- HTTP client: Axios
- Realtime: `socket.io-client`
- UI library:
  - Ant Design 6
  - Bootstrap 5
  - Ant Design Icons
- Map:
  - `react-map-gl`
  - MapLibre GL
  - PMTiles
- Linting:
  - ESLint
  - TypeScript ESLint

Cấu hình Vite nằm ở `vite.config.ts`.

# Bootstrap và routing

`main.tsx` thực hiện:

1. Import global CSS.
2. Import Bootstrap CSS.
3. Import Ant Design reset CSS.
4. Import MapLibre CSS.
5. Mount React app trong `StrictMode`.

`App.tsx` hiện có hai route:

```text
/       -> ChatPage
/login  -> LoginPage
```

Hiện chưa có route riêng cho:

- Profile.
- Settings.
- Friends.
- Upload.
- Map độc lập.
- Health.
- Register.
- Conversation detail.

`AppLayout` có tồn tại ở `AppLayout.tsx`, nhưng hiện chưa được sử dụng trong routing chính.

# Auth flow

Các file chính:

- `LoginPage.tsx`
- `LoginForm.tsx`
- `authService.ts`
- `authStore.ts`

## Login

Frontend gọi:

```text
POST /auth/login
```

Khi login thành công:

1. Nhận `access_token`.
2. Lưu token vào `authStore`.
3. Lưu token vào `localStorage`.
4. Gọi `GET /users/me`.
5. Điều hướng về `/`.

Token được lưu tại:

```text
localStorage.access_token
```

Auth store lưu:

- `accessToken`
- `user`
- `isAuthenticated`
- `currentUserId`

## Auto refresh khi reload

Trong `App.tsx`, khi app mount:

1. Gọi `POST /auth/refresh`.
2. Backend đọc refresh token từ cookie.
3. Frontend lưu access token mới.
4. Gọi `GET /users/me`.
5. Nếu refresh thất bại thì logout.

Vấn đề:

- Chưa có `ProtectedRoute`.
- User chưa đăng nhập vẫn có thể truy cập `/`.
- `App.tsx` gọi `getCurrentUser()`, sau đó `ChatPage` cũng có thể gọi lại, gây request trùng.
- Route không tự redirect user chưa đăng nhập về `/login`.

# Axios HTTP layer

Service trung tâm là `httpService.ts`.

Cấu hình:

```text
baseURL: VITE_API_BASE_URL
timeout: 10000
withCredentials: true
```

`withCredentials: true` được dùng để gửi refresh-token cookie tới backend.

## Request interceptor

Nếu có access token trong `authStore`, Axios tự thêm:

```http
Authorization: Bearer <access_token>
```

## Response interceptor

Khi nhận HTTP 401:

1. Kiểm tra request đã retry chưa.
2. Nếu chưa, gọi `/auth/refresh`.
3. Lưu token mới.
4. Retry request ban đầu.
5. Nếu nhiều request cùng lúc bị 401, các request được đưa vào queue.
6. Nếu refresh thất bại:
   - logout.
   - chuyển browser về `/login`.

Các điểm cần lưu ý:

- Queue đang dùng `any[]`.
- Chưa thấy loại trừ riêng endpoint `/auth/refresh` khỏi flow retry.
- Nếu refresh endpoint cũng trả 401, cần đảm bảo không tạo vòng lặp.
- Một số service không dùng Axios mà dùng `fetch`, khiến behavior auth không thống nhất.

# MobX stores

## Auth store

`authStore.ts`

Quản lý:

```text
accessToken
user
isAuthenticated
currentUserId
```

Dùng `makeAutoObservable`.

## User store

`userStore.ts`

Quản lý:

- `currentUser`
- `selectedUser`
- User cache theo ID
- Loading state theo từng user
- Update profile
- Presence status của user

Store có cơ chế tránh gọi trùng `getUserById()` khi user đã được cache hoặc đang loading.

## Chat store

`chatStore.ts`

Quản lý:

```text
conversations
messages theo topicId
activeConversationId
currentTopicId
isLoading
```

Các hành động chính:

- Load conversations.
- Chọn conversation.
- Load messages.
- Chọn topic.
- Gửi message.
- Thêm incoming message từ Socket.IO.
- Tránh insert duplicate message theo `message.id`.

Khi load conversation thành công, frontend tự chọn conversation đầu tiên.

## Topic store

`topicStore.ts`

Quản lý danh sách topic hiện tại.

Chức năng:

- Load topic theo conversation.
- Tạo topic.
- Thêm topic mới vào store.

Hiện store chỉ giữ một danh sách topic, chưa cache theo từng `conversationId`.

## Friendship store

`friendStore.ts`

Quản lý:

- Pending friend requests.
- Danh sách bạn bè.
- Kết quả search user.
- Loading state.

Một số field vẫn dùng `any[]`, chưa có type model chặt chẽ.

## Presence stores

Presence được tách thành nhiều store:

- `presenceStore.ts`
- `sharedFocusStore.ts`
- `cameraSyncStore.ts`
- `realtimeSessionStore.ts`
- `socketSessionStore.ts`

Các store này phục vụ:

- User online trên map.
- Điểm focus được chia sẻ.
- Camera position.
- Session realtime.
- Socket connection status.

# Chat UI flow

Entry chính là `ChatPage.tsx`.

Khi có access token:

1. Load current user.
2. Khởi tạo chat socket.
3. Load conversation list.
4. Chọn conversation đầu tiên nếu có.
5. Render giao diện desktop hoặc mobile tùy viewport.

## Desktop

Desktop layout nằm ở:

- `DesktopChatLayout.tsx`
- `MainLayout.tsx`
- `LeftSideBar.tsx`
- `RightSideBar.tsx`

Bố cục dự kiến:

```text
Left sidebar  | Main chat/map | Right sidebar
```

Left sidebar hiển thị:

- Conversation list.
- Friend search.
- Một số control phụ.

Main chat hiển thị:

- Topic tabs.
- Message list hoặc map mode.
- Message input.
- Create topic modal.

Right sidebar hiện có các tab:

```text
AI
Assistant
Agents
Social
Feed
Friends
Groups
```

Phần lớn tab bên phải hiện mới là placeholder hoặc chưa có business workflow hoàn chỉnh.

## Mobile

Mobile layout nằm ở:

- `MobileChatLayout.tsx`
- `MobileConversationScreen.tsx`
- `MobileBottomNav.tsx`

Mobile sử dụng state nội bộ để chuyển giữa:

```text
sidebar
chat
right
```

Không dùng nested routing cho các màn hình mobile.

# Conversation và topic flow

Khi conversation được chọn trong `chatStore`:

1. `ChatWindow` gọi API lấy topic.
2. Topic đầu tiên được tự động chọn.
3. Khi topic được chọn, frontend gọi API lấy messages.
4. Topic tabs cho phép chuyển topic.
5. Create topic modal gọi API tạo topic rồi cập nhật store.

Các service chính:

- `ChatService.ts`
- `TopicService.ts`

Backend contract đang được frontend kỳ vọng:

```text
GET  /conversations
GET  /messages?topicId=<id>
POST /messages
GET  /topics/conversation/:conversationId
POST /topics
```

# Message flow

## Load messages

Frontend gọi:

```text
GET /messages?topicId=<id>
```

Response được normalize bởi `Message.ts`.

Frontend hỗ trợ cả hai kiểu field:

```text
camelCase
snake_case
```

Ví dụ:

```text
conversationId
conversation_id
topicId
topic_id
createdAt
created_at
```

## Send message

Frontend gọi:

```text
POST /messages
```

Payload gồm:

```text
conversationId
topicId
content
type
```

Sau khi gửi thành công, response được normalize thành frontend `Message`.

## Realtime message

Chat socket nằm ở:

- `socket.ts`
- `chatSocket.ts`
- `chatRealTimeService.ts`
- `chatHandlers.ts`

Socket kết nối tới:

```text
${VITE_SOCKET_URL}/chat
```

Mặc định:

```text
http://localhost:5000/chat
```

Frontend gửi token qua `socket.auth`.

Khi conversation thay đổi:

1. Frontend gọi `conversation:join`.
2. Backend kiểm tra membership.
3. Socket join conversation room.
4. Khi backend emit `message:new`, frontend đưa message vào `chatStore`.

Các điểm chưa hoàn thiện:

- Chưa có pagination message.
- Chưa có optimistic update hoàn chỉnh.
- Chưa có retry khi gửi thất bại.
- Chưa có delivery/read status rõ ràng.
- Chưa có edit/delete message.
- Chưa có reaction thực tế.
- Emoji và attachment control chưa có đầy đủ handler.
- `ChatService` bắt lỗi rồi trả `[]`, nên lỗi API bị hiển thị giống trạng thái “không có message”.

# Friendship flow

Service nằm ở `friendService.ts`.

Frontend gọi các API:

```text
GET  /users/search?q=...
POST /friends/request
GET  /friends/pending
POST /friends/:id/accept
POST /friends/:id/reject
GET  /friends
```

UI chính:

- `FriendSearchBar.tsx`
- `FriendSearchResults.tsx`

Hiện frontend đã có flow:

1. Nhập từ khóa.
2. Search user.
3. Hiển thị kết quả.
4. Gửi friend request.

Store cũng đã có các method accept/reject/load friends, nhưng chưa thấy một màn hình hoàn chỉnh để hiển thị toàn bộ:

- Pending requests.
- Friends list.
- Trạng thái request.
- Unfriend action.

# User service

Service nằm ở `userService.ts`.

Frontend hiện gọi:

```text
GET /users/me
GET /users/:id
PUT /users/profile
```

Backend hiện có:

```text
GET   /users/me
PATCH /users/me
GET   /users/search
```

Có hai contract không khớp:

```text
Frontend: GET /users/:id
Backend:  chưa thấy route này
```

và:

```text
Frontend: PUT /users/profile
Backend:  PATCH /users/me
```

Đây là vấn đề cần sửa khi nối hoàn chỉnh user profile.

Hiện chưa có profile page hoặc settings page chính thức.

# Map và Chat Map

Các file chính:

- `MapView.tsx`
- `MapControls.tsx`
- `MapCamera.tsx`
- `MapAvatarMarker.tsx`
- `ChatMapMode.tsx`

Map dùng:

- `react-map-gl/maplibre`
- MapLibre GL
- MapTiler streets style

Map có:

- Navigation controls.
- Geolocation controls.
- User avatar markers.
- Online status.
- Camera movement.
- Long press trên map.
- Shared focus point.
- Map focus overlay.

Map mặc định đặt ở khu vực Hồ Chí Minh:

```text
longitude: 106.6297
latitude: 10.8231
zoom: 13
```

## Chat map mode

`ChatMapMode.tsx` được hiển thị thay cho message list khi:

```text
chatMapStore.enabled === true
```

Component hiện load presence bằng conversation ID hardcoded:

```text
"1"
```

Thay vì conversation hiện tại.

Đây là lỗi logic rõ ràng khi người dùng chuyển sang conversation khác.

## Shared focus

Khi long press map:

1. Lấy longitude/latitude.
2. Gửi event shared focus.
3. Event được hiển thị trên map overlay.
4. Remote event có thể được nhận qua presence socket.

Các vấn đề:

- MapTiler key đang hardcoded trong `MapView.tsx`.
- PMTiles dependency chưa thấy được dùng.
- `mapCameraStore` và `cameraSyncStore` cùng tồn tại.
- Camera mới được lưu local, chưa thấy broadcast realtime đầy đủ.
- Chưa có loading/error UI rõ ràng cho map.
- Chưa có clustering cho nhiều marker.

# Presence realtime

REST service nằm ở `presenceService.ts`.

Nó gọi:

```text
/api/presence/conversations/:conversationId
```

Nhưng service này dùng `fetch` trực tiếp, không dùng Axios. Vì vậy:

- Không tự gắn Bearer token.
- Không dùng `VITE_API_BASE_URL`.
- Phụ thuộc vào dev proxy hoặc backend proxy `/api`.
- Không đi qua cơ chế auto refresh token.

Presence socket có kiến trúc riêng:

- `presenceRealtimeService.ts`
- `presenceSocket.ts`
- `socketClient.ts`
- `presenceHandlers.ts`

Các event dự kiến:

```text
join-room
leave-room
shared-focus
live-presence
```

Presence service có logic:

1. Initialize socket.
2. Join room theo conversation.
3. Lưu realtime session.
4. Khi reconnect thì recover session.
5. Khi đổi conversation thì leave room cũ và join room mới.

Tuy nhiên trong flow hiện tại, `ChatMapMode` chỉ gọi REST presence với `"1"`. Chưa thấy nó gọi:

```text
presenceRealtimeService.initialize(currentConversationId)
```

Do đó presence realtime có khả năng chưa được kích hoạt đầy đủ trong UI hiện tại.

Ngoài ra có nhiều cấu hình socket:

- Chat socket mặc định port `5000`.
- Presence socket có cấu hình mặc định khác, trong report hiện tại là `8000`.

Cần kiểm tra lại đây là hai server có chủ ý hay là cấu hình bị lệch.

# Giao diện và styling

Global CSS nằm ở:

- `index.css`
- `App.css`

Hiện CSS vẫn mang nhiều dấu hiệu từ Vite starter:

- Font mặc định system/Arial.
- Màu tím mặc định Vite.
- Logo animation mẫu.
- `.card` style mẫu.
- Dark/light scheme tự động.
- `body` bị `overflow: hidden`.
- `#root` có max-width và padding mặc định.

Bootstrap và Ant Design được dùng đồng thời. Điều này có thể gây:

- Trùng hệ thống spacing.
- Khác behavior button/form.
- Khó kiểm soát responsive.
- CSS specificity cạnh tranh.

# Các contract frontend/backend đang lệch

Các điểm cần agent ưu tiên kiểm tra:

## User identity

Backend JWT strategy trả:

```text
req.user.userId
```

Nhưng một số backend controller dùng:

```text
req.user.id
```

Frontend hiện không trực tiếp xử lý được sự lệch này, nhưng các API conversation có thể lỗi vì nó phụ thuộc backend.

## User profile

Frontend:

```text
GET /users/:id
PUT /users/profile
```

Backend hiện có:

```text
GET /users/me
PATCH /users/me
```

## Presence

Frontend gọi:

```text
/api/presence/conversations/:id
```

Trong danh sách backend controller hiện tại chưa thấy endpoint tương ứng.

## Conversation response

Frontend kỳ vọng conversation có các field như:

```text
id
title
type
lastMessage
lastMessageAt
members
```

Backend cần giữ response contract ổn định theo model `Conversation.ts`.

## Message response

Frontend có normalize camelCase/snake_case, nhưng tốt nhất backend nên trả một format duy nhất để tránh logic tương thích rải trong client.

# Các phần hiện đang là prototype hoặc chưa hoàn chỉnh

- Protected route.
- Register UI.
- Profile/settings page.
- Friends page.
- Pending request page.
- Upload UI.
- Message attachment.
- Message edit/delete.
- Delivery/read status.
- Reactions.
- Pagination.
- Presence realtime lifecycle.
- Camera synchronization realtime.
- Map API key configuration.
- Error state riêng thay vì trả `[]`.
- Strong typing cho friendship data.
- Right sidebar business content.
- AppLayout integration.

# Kết luận cho agent

Frontend hiện là một **React SPA cho chat và bản đồ cộng tác**, với luồng chính:

```text
React/Vite
    ↓
BrowserRouter
    ↓
ChatPage
    ↓
MobX stores
    ↓
Axios HTTP + Socket.IO
    ↓
NestJS backend
```

Luồng chat chính:

```text
Login
  ↓
Refresh access token
  ↓
Load current user
  ↓
Load conversations
  ↓
Select conversation
  ↓
Load topics
  ↓
Select topic
  ↓
Load messages
  ↓
Join Socket.IO conversation room
  ↓
Send/receive realtime messages
```

Những việc agent cần nắm trước khi phát triển tiếp:

1. Chuẩn hóa contract frontend/backend cho user, profile, message và presence.
2. Thêm protected routing.
3. Không nuốt lỗi API thành `[]`.
4. Dùng một HTTP client thống nhất cho mọi request có authentication.
5. Dùng conversation ID thực tế thay cho `"1"` trong chat map.
6. Kích hoạt và cleanup presence realtime theo lifecycle của conversation.
7. Đưa MapTiler key vào environment variable.
8. Hoàn thiện friends/profile/upload UI.
9. Chuẩn hóa state và type, đặc biệt friendship.
10. Tách rõ phần chat socket và presence socket, hoặc thống nhất chúng nếu backend chỉ có một realtime gateway.

Mình chỉ đọc và tổng hợp source frontend, không sửa file nào.






Hiện tại frontend đang dùng react thuần, nó không có vấn đề gì ngoài vấn đề CEO kém
Nhưng nhận thấy NextJS đáp ứng cả hai cho nên mình quyết định đổi sang cho mục đích phát triển lâu dài

Frontend hiện tại đã có giao diện chia layout bài bản, khi refactor mình muốn giao diện vấn như vậy hoặc đẹp hơn, vì layout và giao diện hiện tại nhìn hơi cứng ngắt một chút, về chat hiện tại là ở component chat có chat thường và chat map trong đó chat map để sau, chưa làm tới, nhưng phải đưa cái map vào cho mình, vì sau khi chat ổn định mình sẽ làm chức năng chia sẽ vị trí, 2 người thấy được vị trí của nhau
Về kiến trúc hiện tại nó đang theo modular và mình thấy nó rất hợp để phát triển và scale, khi refactor mình vấn muốn kiểu này
Về các site sẽ có 3 site, theo mình nghĩ là vậy, 1 site chat tức là app chat này, 1 site admin(chưa làm tới cứ để trống), 1 site kiểu landing page khi người ta vào đăng ký đăng nhập gì đó
Hiện tại source FE cũ là frontends, source mới là frontend, khác nhau ở chữ "s" để phân biệt, mình muốn bạn đọc source cũ để chia ra các phase refactor từng bước frontend sao cho dùng được các chức năng cơ bản và đúng kiến trúc dễ scale dễ dev dễ maintain SOLID
vì chúng ta sử dụng socket nhiều nên phải tổ chức chỗ này sao cho hợp lý và dễ phát triển



///////////////////////////////////////////////////////////////////

Mình đã đọc source FE cũ `frontends` và source Next mới `frontend`.

Nhận xét nhanh: hướng refactor sang NextJS là hợp lý. Source cũ có layout/module tốt, nhưng bị yếu ở SEO, routing, auth boundary, state mixing và socket lifecycle. Source mới đang có nền đúng ý bạn: **Next 16, React 19, Redux Toolkit, TanStack Query, Zustand, shadcn/base-ui/lucide**.

**Kiến Trúc Đề Xuất**

Giữ modular, nhưng chia rõ vai trò:

```text
frontend/src/
├── app/                    Next App Router
│   ├── page.tsx            landing redirect hoặc landing
│   ├── (public)/           landing, login, register
│   ├── (chat)/chat         app chat chính
│   └── (admin)/admin       admin để trống trước
├── modules/
│   ├── auth/
│   ├── user/
│   ├── chat/
│   ├── topic/
│   ├── friendship/
│   ├── map/
│   ├── presence/
│   └── realtime/
├── shared/
│   ├── ui/
│   ├── types/
│   ├── hooks/
│   └── constants/
├── lib/
│   ├── api/
│   └── env/
├── store/                  Redux app state
└── stores/                 Zustand UI/ephemeral stores
```

Phân vai state:

```text
TanStack Query:
- auth me
- conversations
- topics
- messages
- friends
- pending requests
- user search

Redux:
- selected conversation
- selected topic
- active site/app area
- global app state cần debug rõ

Zustand:
- sidebar collapsed
- mobile panel
- composer draft
- socket connection status
- map UI/camera/focus local
- optimistic temporary message nếu cần
```

Không dùng Redux để chứa toàn bộ message list nếu đã có TanStack Query. Query cache hợp hơn cho server state.

**Phase 0: Chuẩn Hóa Nền Next**

Mục tiêu: app chạy sạch, chưa cần đủ feature.

Làm:

- Setup env:
  - `NEXT_PUBLIC_API_URL=http://localhost:3000`
  - `NEXT_PUBLIC_SOCKET_URL=http://localhost:3000`
  - `NEXT_PUBLIC_MAPTILER_KEY=...`
- Hoàn thiện `apiClient`:
  - `withCredentials: true`
  - gắn `Authorization: Bearer token`
  - refresh token khi 401
  - không retry vòng lặp với `/auth/refresh`
- Tạo route groups:
  - `(public)` cho landing/login/register
  - `(chat)` cho app chat
  - `(admin)` để trống trước

Deliverable: Next app chạy, providers ổn, route rõ.

**Phase 1: Auth Trước**

Mục tiêu: đăng ký, đăng nhập, giữ session, logout.

Modules:

```text
modules/auth/
├── api/auth.api.ts
├── hooks/useLogin.ts
├── hooks/useRegister.ts
├── hooks/useCurrentUser.ts
├── types/auth.types.ts
├── stores/auth-ui.store.ts
└── components/
```

API cần nối:

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /users/me
```

Lưu ý: access token có thể giữ trong Zustand/in-memory + localStorage tạm thời. Refresh cookie backend tự giữ.

Deliverable: login/register xong vào `/chat`, reload vẫn giữ session.

**Phase 2: Chat Layout**

Mục tiêu: dựng lại layout giống cũ nhưng mềm hơn.

Giữ cấu trúc:

```text
Left sidebar | Chat main | Right sidebar
```

Desktop:

- Left: search friend, conversation list
- Main: topic tabs, message list/map mode, composer
- Right: friends/info placeholder

Mobile:

- bottom nav hoặc panel switch:
  - conversations
  - chat
  - info/map

Deliverable: UI chat trống nhưng layout chuẩn, responsive ổn.

**Phase 3: Chat HTTP Cơ Bản**

Mục tiêu: chat thường chạy không cần socket trước.

Modules:

```text
modules/chat/
├── api/chat.api.ts
├── hooks/useConversations.ts
├── hooks/useMessages.ts
├── hooks/useSendMessage.ts
├── types/chat.types.ts
├── components/
└── stores/chat-ui.store.ts
```

Flow:

```text
GET /conversations
GET /topics/conversation/:conversationId
GET /messages?topicId=:topicId
POST /messages
```

Redux giữ:

```ts
activeConversationId
activeTopicId
```

TanStack Query giữ:

```ts
conversations
topics by conversationId
messages by topicId
```

Deliverable: chọn conversation, load topic, gửi tin nhắn, thấy message hiển thị.

**Phase 4: Socket Realtime**

Mục tiêu: nhận message realtime ổn định.

Tạo module riêng:

```text
modules/realtime/
├── client/socket-client.ts
├── managers/socket-manager.ts
├── hooks/useSocketConnection.ts
├── hooks/useConversationSocket.ts
├── types/socket-events.ts
└── stores/socket.store.ts
```

Không để component gọi socket lung tung. Component chỉ dùng hook:

```ts
useConversationSocket(activeConversationId)
```

Socket manager lo:

- connect khi có access token
- disconnect khi logout
- reconnect
- update auth token khi refresh
- join/leave conversation
- cleanup listener
- dedupe message
- update TanStack Query cache khi nhận `message:new`

Event hiện tại:

```text
conversation:join
conversation:leave
message:new
```

Deliverable: mở 2 browser, user A gửi, user B nhận realtime.

**Phase 5: Friendship**

Mục tiêu: kết bạn đủ dùng cho tạo chat.

Modules:

```text
modules/friendship/
├── api/friendship.api.ts
├── hooks/useSearchUsers.ts
├── hooks/useFriends.ts
├── hooks/usePendingRequests.ts
├── components/
└── types/friendship.types.ts
```

API:

```text
GET  /users/search?q=
POST /friends/request
GET  /friends
GET  /friends/pending
POST /friends/:id/accept
POST /friends/:id/reject
DELETE /friends/:id
```

Deliverable: tìm user, gửi request, accept, thấy friend list.

**Phase 6: Chat Map Đưa Vào Nhưng Chưa Làm Sâu**

Mục tiêu: trong chat có tab/toggle `Chat` và `Map`, map render được theo conversation hiện tại.

Modules:

```text
modules/map/
modules/presence/
modules/chat-map/
```

Ở phase này chỉ cần:

- Map hiển thị trong chat main.
- Không hardcode conversation `"1"`.
- Dùng `activeConversationId`.
- MapTiler key lấy từ env.
- UI để sau này gắn location sharing.

Deliverable: chuyển sang map mode trong conversation, map render ổn.

**Phase 7: Location/Presence Realtime Sau**

Chưa làm ngay, nhưng kiến trúc phải chừa chỗ.

Sau này có thể thêm event:

```text
location:share
location:update
location:stop
presence:update
map:focus
```

Nên tổ chức socket kiểu plugin/channel:

```text
realtime manager
├── chat channel
├── presence channel
├── location channel
└── map focus channel
```

Như vậy chat không bị lẫn với map/location.

**Thứ Tự Mình Khuyên Làm**

```text
1. Auth
2. Layout
3. Chat HTTP
4. Socket realtime message
5. Friendship

6. Chat map shell
7. Location sharing
8. Admin
9. Landing SEO polish
```

Đây là đường ít rủi ro nhất: chat thường chạy trước, socket vào sau, rồi mới map/location. Như vậy frontend refactor không bị biến thành một lần đại phẫu quá căng.
