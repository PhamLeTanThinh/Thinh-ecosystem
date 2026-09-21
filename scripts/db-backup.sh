#!/usr/bin/env bash
# Backup tay: DATABASE_URL="..." ./scripts/db-backup.sh
# Restore:    pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" file.dump
#             (file .gpg: gpg -d file.dump.gpg > file.dump trước)
set -euo pipefail
: "${DATABASE_URL:?Cần đặt DATABASE_URL}"
mkdir -p backups
FILE="backups/backup-$(date +%Y%m%d-%H%M%S).dump"
pg_dump "$DATABASE_URL" --format=custom --no-owner --no-privileges -f "$FILE"
echo "Đã lưu $FILE"
