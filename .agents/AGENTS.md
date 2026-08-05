# Cấu trúc dự án và Repo Git

Dự án được chia làm 2 phần riêng biệt với 2 kho lưu trữ (repo) khác nhau. Tuyệt đối ghi nhớ để không push nhầm hoặc nhầm lẫn khi xem code:

1. **Frontend (Giao diện React)**:
   - Lưu tại repo: `https://github.com/ZanNghiaaa/SAKEG0_WEBSITE.git`
   - Đường dẫn local (tham khảo): `d:\FALL25\EXE402\project - Copy - Copy\`

2. **Backend (Máy chủ Node.js)**:
   - Lưu tại repo: `https://github.com/ZanNghiaaa/SAKEGO_WEB.git`
   - Đường dẫn local (tham khảo): `d:\FALL25\EXE402\SAKE_WEB\SAKEGO_WEB\SaKeFruitWeb-Backend\`

**LUẬT CHUNG:**
- Khi sửa giao diện, code React, UI, phải push lên nhánh `main` của **SAKEG0_WEBSITE**.
- Khi sửa API, database, server (`server.js`), sửa giới hạn upload, phải push lên nhánh `main` của **SAKEGO_WEB**.
