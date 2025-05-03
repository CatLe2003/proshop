# Dùng Node.js base image
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json + package-lock.json từ thư mục gốc
COPY package*.json ./

# Cài đặt dependencies cho toàn bộ project (nếu dùng monorepo style)
RUN npm install

# Copy mã nguồn backend vào thư mục backend trong container
COPY backend/ ./backend

# Copy file .env vào container
COPY .env .env

# Di chuyển vào thư mục backend để chạy server
WORKDIR /app/backend

# Expose cổng 5000
EXPOSE 5000

# Chạy server
CMD ["npm", "start"]
