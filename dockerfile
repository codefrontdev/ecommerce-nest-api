# استخدام صورة أساسية من Node.js 20
FROM node:20

# تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملف package.json و package-lock.json أو npm-shrinkwrap.json (إن وجد)
COPY package*.json ./

# تثبيت التبعيات
RUN npm install --omit=dev --legacy-peer-deps

# نسخ جميع الملفات الأخرى إلى الحاوية
COPY . .

# بناء التطبيق
RUN npm run build

# الأمر الذي سيتم تنفيذه عند بدء الحاوية
CMD ["node", "dist/main"]
