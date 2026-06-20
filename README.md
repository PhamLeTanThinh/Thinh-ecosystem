# Thinh Ecosystem

Personal web ecosystem — portfolio + mini apps tại mỗi `/slug`.

## Stack
| Layer | Service | Dùng cho |
|---|---|---|
| UI + API nhẹ | Vercel + Next.js 14 | Portfolio, serverless routes |
| Database | Postgres (Neon / Railway) | Tất cả data chính |
| File storage | Cloudflare R2 | Ảnh, file uploads |

## Quick start
```bash
npm install
cp .env.example .env.local   # điền credentials
npm run db:push               # tạo tables trên Postgres
npm run dev                   # http://localhost:3000
```

## DB commands
```bash
npm run db:studio    # Drizzle Studio visual editor
npm run db:generate  # tạo migration files
npm run db:migrate   # chạy migrations
```
