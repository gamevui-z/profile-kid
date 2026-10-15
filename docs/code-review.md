# Rà soát mã nguồn — bản quản lý Family gọn

## Phạm vi

Rà `index.html` (HTML, toàn bộ CSS và hai controller JavaScript), `scripts/preview.cjs`, `tests/profile.test.cjs`, `package.json`, `.gitignore`, README và tài liệu kiểm thử. Đối chiếu `trien-khai.md`: đây vẫn là demo, không triển khai backend hoặc thương mại hóa.

## Kết quả

- **Runtime tự chứa:** 2 script inline, 1 khối style, không script src, stylesheet ngoài, @import hoặc @font-face. SVG inline/data URL dùng namespace W3C, không phải request tới W3C/CDN. Không framework hoặc thư viện biểu đồ. Playwright chỉ chạy trong môi trường phát triển.
- **HTML:** không ID trùng, label/ARIA tham chiếu phần tử tồn tại; dialog có tên, Escape, vòng Tab và trả focus. Khi nút kích hoạt cũ đã bị ẩn, focus quay về nút quản lý đang hiện.
- **CSS:** giữ chiều rộng 920px và breakpoint 640/869px; style Family được tách bằng class/id, thêm biểu đồ CSS và danh sách tổng quan. Kiểm tra overflow desktop/mobile cho cả trước/sau kích hoạt.
- **JS hồ sơ:** giữ controller save/reset/avatar; save vẫn là demo trong bộ nhớ. `innerHTML` duy nhất dùng icon SVG hằng trong toast, không đưa input người dùng vào HTML.
- **JS Family:** input hiển thị bằng textContent; username chuẩn hóa/chặn trùng; password chỉ được kiểm tra độ dài và xác nhận, sau đó xóa khỏi form; không lưu trong object hồ sơ, storage hoặc log. Không có xác thực đăng nhập thật.
- **Dữ liệu/tuổi:** dùng trần nhãn game, không dùng nhầm tuổi tối thiểu. Chỉ game 0+ = nhãn 0; ≤12 = nhãn không vượt 12; ≤16 tương tự; không giới hạn cho mọi nhãn minh họa. Chưa liên kết danh mục game thật.
- **Biểu đồ:** 7 cột có giá trị số, nhãn ngày/phút và nguồn mẫu. Hồ sơ mới có lịch sử 0. Biểu đồ không được dùng làm bằng chứng backend đang theo dõi thời gian.
- **Mạng/storage:** không fetch, XHR, WebSocket hoặc beacon. Kiểm thử không ghi nhận request ngoài trang hay localStorage/sessionStorage.
- **Preview server:** chỉ phục vụ `/` và `/index.html` tại loopback; không đọc path do request tùy ý; không có build/runtime dependency.

## Xác minh và giới hạn

9/9 nhóm browser test pass trên Edge/Windows, xem `family-ui-validation.md`. Đã xem ảnh trạng thái đã kích hoạt và quản lý trên desktop/mobile. Kiểm tra syntax hai script, nhãn form và tài nguyên ngoài có trong test suite.

Chưa kiểm thử Safari/Firefox/thiết bị thật, screen reader, zoom 200% hoặc phân quyền/API production. Hồ sơ cũ vẫn có các giới hạn demo và nút avatar 32–34px; không kết luận toàn trang đạt WCAG. Backend đăng nhập, lưu mật khẩu an toàn, thống kê thời gian và lọc danh mục thực tế cần triển khai riêng.

