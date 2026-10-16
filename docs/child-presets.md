# Hồ sơ con và gợi ý thiết lập

## Luồng hiện tại

Form tạo chỉ có sáu trường: tên hiển thị, tên đăng nhập, mật khẩu, xác nhận, ngày sinh, giới tính. Tạo thành công mới hiển thị nhóm tuổi và nội dung đề xuất. Xem trước không sửa hồ sơ; Áp dụng lưu đủ bốn quy tắc (tuổi game, hạn mức, danh mục, từ khóa) rồi mở đúng cài đặt con vừa tạo. Có Tự chỉnh trong cài đặt và Thiết lập sau. Nếu bỏ qua, hồ sơ vẫn tồn tại với mặc định rõ ràng: game 0+, 0 phút/ngày, tất cả danh mục phù hợp tuổi và từ khóa trống. Đây là trạng thái demo, không tuyên bố đã khóa game thật.

Kiểm thử cập nhật: 10 nhóm hồi quy đạt, nhóm mới kiểm tra đúng sáu trường, không lộ đề xuất trước khi tạo, validation ngày sinh, áp dụng đủ bốn quy tắc, sửa tay, để sau không mất con và không thay nhầm hồ sơ khác đều đạt.

Form gồm tên hiển thị, tên đăng nhập, mật khẩu/xác nhận, ngày sinh và giới tính (có Không tiết lộ). Tuổi tính theo ngày sinh tại thời điểm nhập; chặn ngày tương lai, ngày không hợp lệ và tuổi từ 18 trở lên. Không thu căn cước/địa chỉ. Mật khẩu không lưu, chỉ kiểm tra tại chỗ trong demo.

Nhóm không chồng lấn: ≤5, 6–12, 13–16. Trẻ 17 tuổi có thể tự thiết lập hoặc xem nhóm tham khảo. Ngày sinh chọn nhóm gợi ý, không tự sửa quy tắc. Bấm nhóm xem trước; bấm Áp dụng mới thay tuổi game, thời gian, danh mục và từ khóa. Các hạn mức 20/45/60 phút chỉ là dữ liệu minh họa, không phải khuyến nghị sức khỏe.

Danh mục là các nhóm whitelist cố định dùng cho demo; từ khóa là danh sách văn bản ngăn bằng dấu phẩy. Lưu cùng hồ sơ trong bộ nhớ, có thể sửa/lưu/hủy ở quản lý con. Chưa có taxonomy, tìm kiếm game hay backend để thực thi lọc. Production cần chuẩn hóa từ khóa, quy định cách khớp, metadata game và kiểm tra phía server. Không dùng thông tin đăng nhập hoặc ngày sinh thật để demo.

Kiểm thử: 10 nhóm Edge, gồm biên tuổi 5/6/12/13/16, ngày sinh thiếu/tương lai, xem trước không ghi đè, áp dụng, lưu quy tắc và mở lại. Bộ cũ kiểm tra responsive, keyboard, tạo con và mật khẩu. Chưa thử thiết bị thật/Safari/Firefox.

