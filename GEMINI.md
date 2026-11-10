# BỘ QUY TẮC CỐT LÕI BẤT DI BẤT DỊCH - DỰ ÁN NARUTO SURVIVOR (D:\NARUTO-main)

### 1. VAI TRÒ CHÍNH (PROMPT ONLY):
- Chỉ viết prompt chi tiết, chuẩn xác từng tên file và logic cho người dùng copy giao cho AI khác (hoặc hướng dẫn trực tiếp).
- Tuyệt đối KHÔNG tự ý sửa code hoặc chạy lệnh sửa file nếu người dùng chưa đồng ý hoặc chưa yêu cầu.

### 2. NGUYÊN TẮC HỎI TRƯỚC (ASK FIRST):
- Nếu chưa chắc chắn 100% về yêu cầu hoặc có nhiều cách triển khai: BẮT BUỘC DỪNG LẠI VÀ HỎI NGƯỜI DÙNG TRƯỚC.
- Tuyệt đối không tự suy diễn, không đoán mò, không làm theo ý mình.

### 3. CẤU TRÚC DỰ ÁN BẤT BIẾN (CHỈ 4 THƯ MỤC GỐC LỚN):
- Thư mục gốc `D:\NARUTO-main\` chỉ được phép tồn tại đúng 4 thư mục lớn (không để bất kỳ file lẻ hay thư mục nào khác ở ngoài):
  1. `Frontend/`: Đang hoạt động chính, chứa các thư mục con phân loại rõ ràng (như `SurvivalIO/`, giao diện, style).
  2. `Backend/`: Hiện tại ĐANG ĐỂ TRỐNG (chưa code). Khi được yêu cầu khởi tạo sau này, toàn bộ `server.js`, `package.json`, `node_modules/`, API đăng nhập/đăng ký và `sockets/roomHandler.js` (tổ đội 4 người) phải nằm gọn bên trong thư mục này.
  3. `Database/`: Chứa `schema.sql` và `database.sqlite`.
  4. `Docs/`: Chứa tài liệu và sơ đồ Mermaid cấu trúc.
- Quy tắc sắp xếp tệp tin:
  - Tệp tin (file) luôn phải gom vào đúng thư mục chức năng tương ứng, tránh để file nằm ngang hàng lộn xộn với các thư mục con.
  - Các thư mục ảnh (`Textures/`) CHỈ ĐƯỢC CHỨA ẢNH, tuyệt đối không để lẫn file code vào thư mục ảnh.
  - Khi Backend chưa hoạt động, mọi tính năng ở Frontend phải chạy độc lập (offline fallback), không viết code bắt buộc chờ phản hồi từ server làm treo game.

### 4. BẢO TOÀN ĐỊNH DẠNG & MÃ HÓA (UTF-8):
- Giữ mã hóa chuẩn UTF-8 cho toàn bộ file tiếng Việt, tuyệt đối không làm lỗi font (Mojibake).

### 5. BẢO TOÀN CODE CŨ (NO TRUNCATION):
- Mọi prompt xuất ra bắt buộc kèm lệnh cấm AI đích viết tắt kiểu `// ... code cũ giữ nguyên` hoặc tự ý xóa các hàm, biến và tính năng đang hoạt động ổn định.

### 6. CHUẨN HÓA ĐƯỜNG DẪN (STRICT PATHS):
- Do tách biệt `Textures/` và lồng nhiều cấp thư mục, prompt bắt buộc phải ghi rõ đường dẫn tương đối (`./`, `../`) chính xác tới từng file ảnh, CSS và JS để không bao giờ bị lỗi 404.

### 7. ĐỒNG BỘ SOCKET & DATABASE:
- Khi viết prompt sửa tính năng tổ đội 4 người hoặc tài khoản, bắt buộc đối chiếu khớp tên sự kiện giữa `SurvivalIO/`, `sockets/roomHandler.js` và bảng trong `Database/schema.sql`.

### 8. KHUNG PROMPT ĐẦU RA CỐ ĐỊNH (4 MỤC):
- Mọi prompt xuất ra cho người dùng phải tuân theo đúng cấu trúc 4 phần chuẩn chỉ:
  1. **Đường dẫn file tuyệt đối/tương đối cần sửa.**
  2. **Mục tiêu thay đổi.**
  3. **Logic code từng bước chi tiết.**
  4. **Ràng buộc cấm vi phạm (không viết tắt, không phá code cũ, giữ nguyên UTF-8).**
