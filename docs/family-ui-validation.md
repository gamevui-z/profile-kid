# Family UI — phạm vi và kiểm thử

## Baseline

Repo `gamevui-z/profile-kid`, commit `fc5f3eb938b0ada10092e9d2c75741cb849e3cf0`.
Chỉ có `index.html` và `trien-khai.md`; không có backend hoặc assets ngoài.

## Thay đổi

- `index.html`: thêm card toàn hàng giữa thông tin cá nhân và đăng nhập/mạng xã hội; hướng dẫn thu gọn, dialog native, hồ sơ mẫu, điều chỉnh và hủy quy tắc minh họa.
- CSS mới giới hạn ở Family; giữ breakpoint cũ 640/869px và độ rộng trang 920px. Nút mới tối thiểu 44px, dialog cuộn có nút đóng luôn nhìn thấy.
- Controller Family tách khỏi `getFormState`, save/reset và avatar hiện hữu. Đổi hồ sơ khi có thay đổi chưa cập nhật yêu cầu người dùng cập nhật hoặc hủy trước.
- Thêm “Xem các gói”: dùng thử 1 tháng 0đ, 3 tháng, 6 tháng, 1 năm. Giá gói dài hạn để “Giá sẽ công bố”; không tự đặt giá hoặc tạo thanh toán.
- Luồng kích hoạt cha mẹ demo, form tạo con (bí danh, username, mức tuổi, hạn mức), kết quả với thông tin đăng nhập minh họa, tạo thêm con và quản lý các hồ sơ đã tạo.
- Không có activation/API/PIN thật; không lưu mẫu vào localStorage/sessionStorage. Hai hồ sơ xem thử sẵn có reset khi đóng; các hồ sơ người dùng tạo trong demo giữ trong bộ nhớ đến khi reload. Mật khẩu minh họa không được lưu vào hồ sơ.
- `tests/profile.test.cjs`, `package.json`: bộ kiểm thử trình duyệt có thể chạy lại.
- `scripts/preview.cjs`, `README.md`, `.gitignore`: phục vụ preview và hướng dẫn phát triển.

## Đã kiểm thử

Kiểm thử tự động trên Edge headless/Windows bằng Playwright: **6/6 nhóm pass** ở bản mở rộng chọn gói/kích hoạt/tạo con. Xem lịch sử commit/PR cho lần chạy cuối.

- Mở/đóng hướng dẫn; dialog focus, Tab, Escape và trả focus.
- Validation hạn mức rỗng, âm, vượt khoảng, số thập phân; hạn mức 0; cập nhật/hủy; bảo vệ thay đổi đang sửa khi chuyển hồ sơ; xóa mẫu khi đóng.
- Không phát sinh request ngoài trang hoặc browser storage trong luồng Family; không có JavaScript error.
- Hồi quy tên hiển thị, save/reset, mở giấy tờ, ngày sinh khóa, upload/reset avatar và liên kết xác thực mẫu.
- Viewport 320, 375, 390, 640, 641, 768, 868, 869, 1024, 1440px: không tràn ngang; card parent toàn hàng; Đăng nhập/Mạng xã hội chia cột đúng breakpoint.
- ID không trùng, ARIA/label tham chiếu phần tử có thật; touch target nút dialog >=44px; reduced motion; hướng dẫn đọc được khi tắt JavaScript.
- Tên hồ sơ dài và chiều cao 600px: dialog không tràn ngang, nút đóng vẫn trong viewport khi cuộn.
- Ảnh chụp desktop và mobile được kiểm tra trực quan.
- Chọn cả bốn gói, xác nhận demo bắt buộc, kích hoạt, tạo nhiều con, chuẩn hóa username, lỗi username trùng và hạn mức; chuyển sang quản lý hồ sơ vừa tạo.
- Giữ quy tắc khi đóng/mở lại hồ sơ tự tạo; đổi gói giữ các con; “Để sau” không tạo con; reload reset toàn bộ trạng thái demo.
- Nội dung nhập dạng HTML được hiển thị như văn bản; không chèn thành DOM thực thi.
- Dialog onboarding: 6 viewport từ 320–1440px, vòng Tab, Escape, trả focus và không tràn ngang.

## Chưa kiểm thử / điều kiện production

- iOS Safari, Firefox, Samsung Internet, WebView và thiết bị cảm ứng thật.
- Screen reader thực tế, zoom trình duyệt 200% và đánh giá WCAG đầy đủ (viewport hẹp không thay thế tất cả kiểm thử zoom).
- Backend auth/OTP/PIN, phân quyền, API lỗi/xung đột, lưu bền vững, đồng bộ hai máy, thực thi giới hạn khi game chạy.
- Card hồ sơ cũ có nút camera 32–34px và style tương phản cần đánh giá riêng; thay đổi này không chứng nhận toàn trang đạt WCAG.

## Rollback và kiểm tra tích hợp

Revert commit UI qua Git. Không có migration hoặc dữ liệu server cần rollback. Khi tích hợp production, chỉ bật tính năng thật sau khi đã xác minh API và kiểm thử phân quyền theo `trien-khai.md`; phần minh họa không phải bằng chứng tính năng bảo vệ đang hoạt động.

