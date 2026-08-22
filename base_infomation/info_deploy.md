Được. Mình ghi lại thành một **deployment runbook cho Dove trên Ubuntu**, đúng theo những gì chúng ta vừa làm, để sau này bạn đổi server chỉ cần lấy ra làm lại.

> **Scope:** server tạm, không Docker, không staging/UAT/production separation.
> Stack: **Next.js + NestJS + MySQL + Redis + Socket.IO + PM2 + Nginx + HTTPS**.
> Root project: `/home/ubuntu/lain`.

---

# Dove — Deployment Runbook Ubuntu

## 0. Architecture hiện tại

```text
                         Internet
                            │
                            ▼
                  doven.duckdns.org
                            │
                         Nginx
                       :80 / :443
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Next.js :3002                NestJS :3000
              │                           │
              │                    ┌──────┼──────┐
              │                    │      │      │
              │                  MySQL  Redis  Socket.IO
              │                  :3306  :6379    :3000
              │
              └──── Browser
```

PM2:

```text
PM2
├── dove-web
└── dove-api
```

### Port

| Service     | Port | Public?          |
| ----------- | ---: | ---------------- |
| SSH         |   22 | Có               |
| Nginx HTTP  |   80 | Có               |
| Nginx HTTPS |  443 | Có               |
| Next.js     | 3002 | Không cần public |
| NestJS      | 3000 | Không cần public |
| Socket.IO   | 3000 | chung NestJS     |
| MySQL       | 3306 | Không            |
| Redis       | 6379 | Không            |

---

# 1. Ubuntu server

Server hiện tại:

```text
Ubuntu 24.04.4 LTS
x86_64
```

Kiểm tra:

```bash
lsb_release -a
uname -m
```

---

# 2. Node.js

Server hiện tại đã có:

```text
Node.js 22.22.2
npm 10.9.7
```

Kiểm tra:

```bash
node -v
npm -v
```

Project hiện tại dùng:

```text
NestJS 11
Next.js 16.3.1
React 19.2.8
Socket.IO 4.8.3
```

Repo đã có `package-lock.json`, vì vậy khi deploy dùng:

```bash
npm ci
```

**Không dùng `npm install`** nếu muốn cài đúng dependency tree trong lockfile.

---

# 3. MySQL

Cài:

```bash
sudo apt update
sudo apt install mysql-server
```

Kiểm tra:

```bash
mysql --version
```

Kiểm tra service:

```bash
sudo systemctl status mysql --no-pager
```

Phải có:

```text
Active: active (running)
```

---

# 4. Tạo database

Đăng nhập MySQL:

```bash
sudo mysql
```

Tạo database:

```sql
CREATE DATABASE chat_app
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

# 5. Tạo user cho application

Không dùng `root` cho NestJS.

Tạo:

```sql
CREATE USER 'dove_app'@'localhost'
IDENTIFIED BY 'YOUR_DATABASE_PASSWORD';
```

Cấp quyền:

```sql
GRANT ALL PRIVILEGES ON chat_app.* TO 'dove_app'@'localhost';
```

```sql
FLUSH PRIVILEGES;
```

Kiểm tra:

```sql
SHOW GRANTS FOR 'dove_app'@'localhost';
```

Test:

```bash
mysql -u dove_app -p chat_app
```

Nếu login được:

```sql
SHOW TABLES;
```

---

# 6. Project directory

Chúng ta không dùng `/var/www`.

Tạo ngay dưới home:

```bash
mkdir ~/lain
cd ~/lain
```

Kết quả:

```text
/home/ubuntu/lain
```

Đây là root project.

---

# 7. Clone repository

Repo:

```text
https://github.com/phi8c/eden
```

Clone thẳng vào `lain`:

```bash
git clone https://github.com/phi8c/eden.git .
```

Kết quả hiện tại:

```text
/home/ubuntu/lain
├── backend/
├── frontend/
├── base_infomation/
└── ...
```

Backend:

```text
/home/ubuntu/lain/backend
```

Frontend:

```text
/home/ubuntu/lain/frontend
```

---

# 8. Import database

Trong repo hiện tại SQL nằm ở:

```text
/home/ubuntu/lain/backend/chat_app.sql
```

Import:

```bash
cd ~/lain/backend
mysql -u dove_app -p chat_app < chat_app.sql
```

Kiểm tra:

```bash
mysql -u dove_app -p chat_app
```

```sql
SHOW TABLES;
```

---

# 9. Backend dependencies

```bash
cd ~/lain/backend
npm ci
```

Build:

```bash
npm run build
```

Sau đó sẽ có:

```text
backend/
└── dist/
```

---

# 10. Backend `.env`

Tạo:

```bash
cd ~/lain/backend
nano .env
```

Cấu hình production tạm thời của chúng ta:

```env
# =====================
# APP
# =====================

PORT=3000

FE_PORT=http://doven.duckdns.org


# =====================
# DATABASE
# =====================

DB_HOST=127.0.0.1
DB_PORT=3306

DB_USER=dove_app
DB_PASSWORD=YOUR_DOVE_DB_PASSWORD

DB_NAME=chat_app

DB_LOGGING=true
DB_SYNC=false


# =====================
# REDIS
# =====================

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

REDIS_USERNAME=
REDIS_PASSWORD=

REDIS_TLS=false


# =====================
# JWT
# =====================

JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES=1d


# =====================
# SOCKET
# =====================

SOCKET_PORT=3001
```

### Lưu ý

Có một điều quan trọng chúng ta phát hiện trong lúc deploy:

Mặc dù `.env` có:

```env
SOCKET_PORT=3001
```

runtime thực tế **không listen `3001`**.

Khi kiểm tra:

```bash
sudo ss -lntp | grep -E ':3000|:3001|:3002'
```

kết quả là:

```text
*:3000  → node
*:3002  → next-server
```

Không có `3001`.

Điều đó cho thấy Socket.IO hiện tại đang chạy chung với NestJS trên `3000`.

Vì vậy **không được dựa vào `SOCKET_PORT=3001` để mở/proxy port** trong deployment hiện tại.

---

# 11. Redis

Backend của project dùng:

```text
ioredis
bullmq
cache-manager-redis-yet
@socket.io/redis-adapter
```

Server ban đầu chưa có Redis nên NestJS báo:

```text
ECONNREFUSED 127.0.0.1:6379
```

Cài:

```bash
sudo apt update
sudo apt install redis-server
```

Enable + start:

```bash
sudo systemctl enable --now redis-server
```

Kiểm tra:

```bash
sudo systemctl status redis-server --no-pager
```

Test:

```bash
redis-cli ping
```

Kết quả:

```text
PONG
```

Redis chỉ listen localhost:

```text
127.0.0.1:6379
```

Không public port `6379`.

---

# 12. PM2

Cài global:

```bash
sudo npm install -g pm2
```

Kiểm tra:

```bash
pm2 -v
```

---

# 13. Chạy NestJS bằng PM2

```bash
cd ~/lain/backend
pm2 start dist/main.js --name dove-api
```

Kiểm tra:

```bash
pm2 status
```

Log:

```bash
pm2 logs dove-api --lines 50
```

Backend production:

```text
NestJS → :3000
```

---

# 14. Frontend dependencies

```bash
cd ~/lain/frontend
npm ci
```

---

# 15. Frontend `.env`

Frontend ban đầu có:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

Không thể giữ `localhost`, vì browser sẽ hiểu `localhost` là **máy của người dùng**.

Deployment tạm thời:

```env
NEXT_PUBLIC_API_URL=http://doven.duckdns.org/api
NEXT_PUBLIC_SOCKET_URL=http://doven.duckdns.org
```

### Tại sao API có `/api`?

Nginx routing:

```text
/api/login
       ↓
Nginx
       ↓
NestJS /login
```

NestJS **không có global prefix `/api`**.

Nginx sẽ strip `/api`.

Ví dụ:

```text
Browser
GET /api/login
      ↓
Nginx
      ↓
NestJS
GET /login
```

### Socket không có `/api`

Frontend:

```env
NEXT_PUBLIC_SOCKET_URL=http://doven.duckdns.org
```

Socket.IO sẽ request:

```text
/socket.io/
```

Nginx chuyển về NestJS.

---

# 16. Next.js build

Sau khi sửa `.env`:

```bash
cd ~/lain/frontend
npm run build
```

Next.js tạo:

```text
frontend/.next/
```

### Quan trọng

Với:

```env
NEXT_PUBLIC_*
```

phải **build lại sau khi đổi `.env`**.

Chỉ:

```bash
pm2 restart dove-web
```

là chưa đủ nếu chưa build lại.

---

# 17. Chạy Next.js bằng PM2

Project có:

```json
"start": "next start"
```

Nhưng port mặc định của Next.js là `3000`, trùng NestJS.

Do đó chạy Next.js ở `3002`:

```bash
cd ~/lain/frontend
pm2 start npm --name dove-web -- start -- -p 3002
```

Runtime:

```text
Next.js → :3002
NestJS  → :3000
```

---

# 18. PM2 startup

Sau khi cả hai process đều OK:

```bash
pm2 status
```

Phải thấy:

```text
dove-api    online
dove-web    online
```

Lưu:

```bash
pm2 save
```

Tạo startup command:

```bash
pm2 startup
```

PM2 sẽ in ra một command `sudo ...`.

**Copy command đó chạy nguyên văn.**

Sau đó:

```bash
pm2 save
```

---

# 19. Nginx

Server đã có Nginx từ trước.

Kiểm tra:

```bash
sudo nginx -t
```

Server này đang có **2 project khác**, nên không được xóa config cũ:

```text
ai.sadec.co
imgdetector.sadec.co
```

Config của Dove được tạo riêng:

```bash
sudo nano /etc/nginx/sites-available/doven.duckdns.org
```

Nội dung:

```nginx
server {
    listen 80;
    server_name doven.duckdns.org;

    client_max_body_size 100M;

    # Next.js
    location / {
        proxy_pass http://127.0.0.1:3002;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # NestJS API
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }
}
```

---

# 20. Enable Nginx site

```bash
sudo ln -s /etc/nginx/sites-available/doven.duckdns.org \
/etc/nginx/sites-enabled/doven.duckdns.org
```

Test:

```bash
sudo nginx -t
```

Nếu:

```text
syntax is ok
test is successful
```

thì:

```bash
sudo systemctl reload nginx
```

---

# 21. Domain

Domain tạm:

```text
doven.duckdns.org
```

DNS đã được kiểm tra bằng:

```bash
getent hosts doven.duckdns.org
```

và IP trả về khớp với public IP server.

---

# 22. Runtime hiện tại

Kiểm tra:

```bash
sudo ss -lntp | grep -E ':3000|:3001|:3002'
```

Runtime mong muốn:

```text
*:3000 → NestJS
*:3002 → Next.js
```

Không cần `3001` vì Socket.IO hiện tại chạy chung NestJS.

---

# 23. Test local

### NestJS

```bash
curl -i http://127.0.0.1:3000
```

Nếu `/` không có route thì `404` vẫn chứng minh server đã nhận request.

### Next.js

```bash
curl -I http://127.0.0.1:3002
```

### Frontend qua Nginx

```bash
curl -I http://doven.duckdns.org
```

### API qua Nginx

```bash
curl -i http://doven.duckdns.org/api/
```

### Socket.IO

```bash
curl -i "http://doven.duckdns.org/socket.io/?EIO=4&transport=polling"
```

---

# 24. Firewall

Hiện server:

```text
UFW: inactive
```

Chúng ta **chưa bật UFW** vì server đang chạy những project khác và đây là server tạm.

`ss` hiện tại cho thấy:

```text
127.0.0.1:3306 → MySQL
127.0.0.1:6379 → Redis
```

nên hai service này không public.

Ngoài ra server đang có các service khác:

```text
:8000  → uvicorn
:9000  → uvicorn localhost
:8001  → chainlit localhost
:11434 → Ollama localhost
```

**Không đụng vào các service này.**

Khi làm server riêng cho Dove sau này, nên thiết kế firewall/Security Group lại từ đầu.

---

# 25. HTTPS — bước tiếp theo

Hiện tại Dove đang:

```text
http://doven.duckdns.org
```

Nếu muốn HTTPS:

```text
https://doven.duckdns.org
```

thì có thể dùng Let's Encrypt + Certbot.

Cài Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Sau đó:

```bash
sudo certbot --nginx -d doven.duckdns.org
```

Certbot sẽ cấu hình certificate cho Nginx.

Kiểm tra renewal:

```bash
sudo certbot renew --dry-run
```

Sau HTTPS, đổi frontend `.env` thành:

```env
NEXT_PUBLIC_API_URL=https://doven.duckdns.org/api
NEXT_PUBLIC_SOCKET_URL=https://doven.duckdns.org
```

Sau đó:

```bash
cd ~/lain/frontend
npm run build
pm2 restart dove-web
```

Socket.IO khi chạy qua HTTPS sẽ sử dụng secure transport tương ứng (`wss`).

---

# 26. Khi pull code mới

Sau này có code mới:

```bash
cd ~/lain
git pull
```

### Nếu backend thay đổi

```bash
cd ~/lain/backend
npm ci
npm run build
pm2 restart dove-api
```

### Nếu frontend thay đổi

```bash
cd ~/lain/frontend
npm ci
npm run build
pm2 restart dove-web
```

Nếu cả hai:

```bash
cd ~/lain/backend
npm ci
npm run build
pm2 restart dove-api

cd ~/lain/frontend
npm ci
npm run build
pm2 restart dove-web
```

---

# 27. Các lệnh kiểm tra nhanh

### PM2

```bash
pm2 status
```

```bash
pm2 logs dove-api
```

```bash
pm2 logs dove-web
```

Restart:

```bash
pm2 restart dove-api
pm2 restart dove-web
```

Restart tất cả:

```bash
pm2 restart all
```

---

### Nginx

```bash
sudo nginx -t
```

```bash
sudo systemctl status nginx --no-pager
```

```bash
sudo systemctl reload nginx
```

Log:

```bash
sudo tail -f /var/log/nginx/error.log
```

```bash
sudo tail -f /var/log/nginx/access.log
```

---

### MySQL

```bash
sudo systemctl status mysql --no-pager
```

---

### Redis

```bash
sudo systemctl status redis-server --no-pager
```

```bash
redis-cli ping
```

---

# 28. File structure cuối cùng

```text
/home/ubuntu/lain/
│
├── backend/
│   ├── .env
│   ├── node_modules/
│   ├── dist/
│   ├── chat_app.sql
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── .env
│   ├── .next/
│   ├── node_modules/
│   ├── package.json
│   └── package-lock.json
│
└── ...
```

System:

```text
Ubuntu
│
├── MySQL
│   └── chat_app
│
├── Redis
│   └── 127.0.0.1:6379
│
├── PM2
│   ├── dove-api
│   └── dove-web
│
└── Nginx
    └── doven.duckdns.org
```

---

## 29. Checklist deploy server mới

Lần sau bạn có server mới, chỉ cần đi theo checklist này:

```text
[ ] Ubuntu
[ ] Node.js 22
[ ] npm
[ ] MySQL
[ ] Redis
[ ] git
[ ] clone eden
[ ] create chat_app
[ ] create dove_app
[ ] import chat_app.sql

[ ] backend .env
[ ] npm ci
[ ] npm run build
[ ] pm2 dove-api

[ ] frontend .env
[ ] npm ci
[ ] npm run build
[ ] pm2 dove-web :3002

[ ] PM2 startup
[ ] Nginx
[ ] doven.duckdns.org DNS
[ ] Nginx reverse proxy
[ ] test API
[ ] test Socket.IO

[ ] HTTPS
[ ] update NEXT_PUBLIC_API_URL
[ ] update NEXT_PUBLIC_SOCKET_URL
[ ] frontend build lại
[ ] test login
[ ] test realtime chat
[ ] test upload image
```

### Một lưu ý cho server tạm

`backend/chat_app.sql` hiện đang nằm trong Git repo để tiện deploy. **Sau khi test xong**, mình vẫn khuyên xóa dump database khỏi Git:

```bash
cd ~/lain
git rm backend/chat_app.sql
git commit -m "chore: remove database dump"
git push
```

Nếu DB dump chứa dữ liệu thật thì càng nên làm việc này.

Còn về lâu dài, khi bạn bắt đầu tách **dev → staging → UAT → production**, mình sẽ không bê nguyên mô hình tạm này sang tất cả môi trường; lúc đó nên tách domain, secrets, database, process và deployment strategy riêng cho từng environment.
