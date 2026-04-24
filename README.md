# RoomieMatch FE - Frontend Architecture

Dự án này sử dụng kiến trúc **Feature-based** (Feature-Sliced Design), giúp code dễ dàng mở rộng (scale), dễ bảo trì và phân tách rõ ràng trách nhiệm của từng module.

## 📂 Cấu trúc thư mục (Folder Structure)

```text
src/
├── app/                  # Cấu hình mức độ toàn ứng dụng (Global)
│   ├── store.js          # Redux store kết hợp các slices
│   ├── router.jsx        # Cấu hình react-router-dom
│   └── providers.jsx     # Các Provider bọc ngoài app (Theme, AuthContext...)
│
├── features/             # Chứa logic nghiệp vụ chia theo từng tính năng
│   ├── auth/             # Tính năng xác thực (Login, Register)
│   │   ├── api/          # Các endpoint RTK Query (dùng injectEndpoints cho login, register...)
│   │   ├── components/   # UI components dùng RIÊNG cho auth (LoginForm, RegisterForm)
│   │   ├── hooks/        # Custom hooks nội bộ (useAuth, useLogin)
│   │   ├── slice.js      # Redux slice quản lý state của auth
│   │   └── index.js      # BẮT BUỘC: Public API của feature này (export ra để nơi khác dùng)
│   │
│   └── user/             # Tính năng quản lý người dùng (Profile, Settings)
│       └── ...
│
├── shared/               # Code dùng chung toàn hệ thống (UI, Utils, API Base)
│   ├── api/              # baseQuery, cấu hình baseApi của RTK Query (gắn token, xử lý lỗi...)
│   ├── components/       # Các UI components tái sử dụng (Button, Input, Modal, Table...)
│   ├── hooks/            # Custom hooks dùng chung (useDebounce, useOnClickOutside...)
│   ├── utils/            # Các hàm helper (formatMoney, formatDate...)
│   ├── constants/        # Hằng số (HTTP_STATUS, ROLE, API_ENDPOINTS...)
│   ├── assets/           # Tài nguyên tĩnh (images, icons, fonts)
│   └── styles/           # Global CSS, SCSS, mixins
│
├── layouts/              # Các bố cục trang (MainLayout, AuthLayout...)
│
├── pages/                # Nơi "lắp ráp" các components/features lại thành 1 trang hoàn chỉnh theo URL
│   ├── HomePage.jsx
│   └── ...
│
├── App.jsx               # Entry component của React
└── main.jsx              # Entry point gắn React vào DOM
```

## 📝 Quy tắc làm việc (Dành cho Team)

1. **KHÔNG import chéo giữa các Feature**: 
   - Feature `A` không được import sâu vào trong cấu trúc của Feature `B`. 
   - Nếu Feature `A` cần dùng chức năng của Feature `B`, hãy export chức năng đó qua file `index.js` ở thư mục gốc của Feature `B`.
2. **Khi nào tạo file ở `shared/` và khi nào tạo ở `features/`?**
   - Nếu component/hàm chỉ dùng cho 1 tính năng (VD: `LoginForm`), hãy để trong `features/auth/components`.
   - Nếu component/hàm được dùng ở 2 nơi trở lên (VD: `Button`, `formatDate`), hãy chuyển nó vào `shared/`.
3. **Thư mục `pages/`**:
   - `pages/` chỉ chứa các file đóng vai trò là "Trang" ghép nối với `react-router-dom`. Tránh viết logic nghiệp vụ phức tạp trực tiếp ở đây, hãy tách logic vào `features`.
4. **State Management**:
   - Chỉ lưu vào Redux Store (`features/*/slice.js`) những state cần chia sẻ giữa nhiều component không có quan hệ cha-con.
   - Các state nội bộ (như input form, modal open/close) thì nên dùng `useState` ở mức component.

## 🚀 Cài đặt & Chạy dự án

```bash
# Cài đặt thư viện
npm install

# Chạy server phát triển
npm run dev
```
