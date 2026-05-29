**HỆ THỐNG QUẢN LÝ NHÀ HÀNG BÒ NÉ MỸ CẢNH**
**ĐẶC TẢ VÀ PHÂN TÍCH YÊU CẦU**

# 1. ĐẶC TẢ VÀ PHÂN TÍCH YÊU CẦU {#đặc-tả-và-phân-tích-yêu-cầu}

Nhà hàng cần quản lý toàn diện việc phục vụ khách hàng, chế biến, thanh toán và kiểm soát vật tư trên máy vi tính. Qua phân tích sơ đồ luồng dữ liệu, hệ thống nắm được những thông tin sau:

### Quản lý đặt bàn và gọi món:

Khách hàng có thể yêu cầu đặt bàn trực tiếp tại nhà hàng hoặc thông qua điện thoại. Nhân viên Phục vụ là người tiếp nhận thông tin đặt bàn, kiểm tra tình trạng bàn trống trên hệ thống và nhập thông tin đặt bàn vào phần mềm. Hệ thống ghi nhận thông tin khách hàng, số điện thoại, thời gian đặt, số người và bàn được chọn, sau đó cập nhật trạng thái bàn thành "Đã đặt". Đối với khách dùng bữa trực tiếp tại nhà hàng, nhân viên Phục vụ tiếp nhận yêu cầu gọi món và ghi nhận order trên hệ thống.

### Quy trình xử lý bếp và phục vụ:

Hệ thống tự động trích xuất các chi tiết món ăn cần làm từ CSDL Phiếu Order để gửi lệnh in phiếu order xuống cho Bộ phận Bếp. Quán quy mô nhỏ nên chỉ có một bộ phận chế biến là Bếp (không có quầy pha chế riêng); đồ uống do nhân viên Phục vụ tự lấy và phục vụ trực tiếp, không qua Bếp. Sau khi chế biến xong, Bộ phận Bếp cập nhật trạng thái món (Đang chế biến → Đã xong). Hệ thống ghi nhận thay đổi vào CSDL Phiếu Order và phát thông báo cho Phục vụ.

### Quy trình thanh toán:

Khi khách yêu cầu tính tiền, Thu ngân chọn bàn tương ứng. Hệ thống truy xuất dữ liệu các món từ CSDL Phiếu Order để tính tổng. Tổng tiền = Tổng tiền món + Thuế VAT (nếu áp dụng). Thu ngân xác nhận thu tiền (tiền mặt hoặc chuyển khoản). Hệ thống lưu giao dịch vào CSDL Hóa đơn, cập nhật bàn về \"Trống\", trả hóa đơn và tiền thừa cho khách.

### Quản lý kho hàng:

Bộ phận kho lập các lệnh nhập/xuất kho với đầy đủ thông tin số lượng và đơn giá. Hệ thống cập nhật số liệu tồn kho và lưu trữ phiếu nhập/xuất vào CSDL Kho.

### Quản lý thực đơn:

Quản lý nhà hàng quản lý danh sách món ăn/đồ uống. Khi có món mới, thêm vào CSDL Thực đơn (tên, loại, đơn giá, mô tả). Cập nhật trạng thái (Còn hàng/Hết hàng), chỉnh sửa đơn giá hoặc xóa món.

### Quản lý bàn:

Quản lý thiết lập danh sách bàn: số bàn, khu vực, sức chứa, trạng thái (Trống/Có khách/Đã đặt).

### Phân quyền người sử dụng:

Hệ thống phân quyền cho 5 vai trò: Quản lý (Admin), Phục vụ, Bộ phận Bếp, Thu ngân, Bộ phận Kho.

# 2. DANH SÁCH CÁC YÊU CẦU {#danh-sách-các-yêu-cầu}

## Bộ phận Thu ngân

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Lập báo cáo doanh thu | Kết xuất | Tổng doanh thu = ∑ (Tổng tiền các hóa đơn đã thanh toán trong kỳ). | TN_BM1 |  |
| 2 | Xử lý thanh toán | Tính toán | TN_QĐ1 | TN_BM2 | Xem bảng quy định |
| 3 | Xuất hóa đơn | Kết xuất | Hóa đơn đầy đủ: thông tin nhà hàng, chi tiết món, SL, đơn giá, thành tiền, thuế VAT, ngày giờ. | TN_BM3 |  |

## Bộ phận Phục vụ

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Tiếp nhận đặt bàn trực tiếp/qua điện thoại | Lưu trữ | PV_QĐ1 | PV_BM1 | Xem bảng quy định |
| 2 | Ghi nhận gọi món | Lưu trữ | Món phải có trong thực đơn, trạng thái "Còn hàng". SL > 0. | PV_BM2 |  |
| 3 | Bàn giao cho bếp | Lưu trữ | Khi Phục vụ chốt order: món ăn chuyển xuống Bếp; đồ uống phục vụ trực tiếp (không qua Bếp). | PV_BM3 |  |
| 4 | Phục vụ món ra bàn | Lưu trữ | Nhận thông báo khi món "Đã xong". Xác nhận đã phục vụ → trạng thái món chuyển "Đã phục vụ". | PV_BM4 |  |

*Ghi chú:* Khi khách đặt bàn đến, Phục vụ mở màn hình "Tiếp nhận đặt bàn" để đánh dấu phiếu đặt "Đã nhận bàn" (cập nhật trạng thái thủ công, không tách thành chức năng riêng) rồi vào màn ghi nhận gọi món bình thường.

## Bộ phận Bếp

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Nhận phiếu order | Tra cứu | Nhận phiếu theo thứ tự thời gian. Xác nhận đã nhận. Kiểm tra nguyên liệu. | B_BM1 |  |
| 2 | Cập nhật trạng thái món | Lưu trữ | Chờ chế biến → Đang chế biến → Đã xong. Thông báo tự động cho Phục vụ. | B_BM2 |  |

## Bộ phận Kho

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Lập phiếu nhập kho | Lưu trữ | K_QĐ1. Tính ngay tổng giá trị nhập = ∑ (SL × Đơn giá). | K_BM1 | Bao gồm tính hóa đơn nhập |
| 2 | Lập phiếu xuất kho | Lưu trữ | K_QĐ1. Không xuất quá tồn. Tính ngay tổng giá trị xuất = ∑ (SL × Đơn giá). | K_BM2 | Bao gồm tính hóa đơn xuất |
| 3 | Báo cáo tồn kho | Kết xuất | Tồn cuối = Tồn đầu + Nhập − Xuất. | K_BM3 |  |
| 4 | Báo cáo nhập kho | Kết xuất | Thống kê tổng NVL đã nhập trong khoảng thời gian. | K_BM4 |  |
| 5 | Báo cáo xuất kho | Kết xuất | Thống kê tổng NVL đã xuất trong khoảng thời gian. | K_BM5 |  |

## Quản lý (Admin)

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Quản lý thực đơn | Lưu trữ | Thêm/sửa/xóa món. Cập nhật trạng thái, đơn giá. | QL_BM1 |  |
| 2 | Quản lý bàn | Lưu trữ | Thêm/sửa/xóa bàn. Thiết lập sức chứa, khu vực. | QL_BM2 |  |
| 3 | Xem báo cáo tổng hợp | Kết xuất | Xem tất cả báo cáo: doanh thu, tồn kho, nhập/xuất. | QL_BM4 |  |

*Ghi chú:* Các chức năng hệ thống do Admin thực hiện (quản lý tài khoản, cấu hình hệ thống, sao lưu/phục hồi) và chức năng đăng nhập áp dụng cho mọi vai trò được liệt kê tại §5 — không thuộc nhóm nghiệp vụ.

# 3. BẢNG YÊU CẦU CHỨC NĂNG NGHIỆP VỤ {#bảng-yêu-cầu-chức-năng-nghiệp-vụ}

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 11%" />
<col style="width: 23%" />
<col style="width: 58%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Mã số</strong></th>
<th style="text-align: center;"><strong>Tên quy định</strong></th>
<th style="text-align: center;"><strong>Mô tả chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>TN_QĐ1</td>
<td>Quy định thanh toán</td>
<td><p>- Chỉ thanh toán khi tất cả món đã "Đã phục vụ" hoặc "Đã hủy".</p>
<p>- Tổng tiền = ∑ (SL × Đơn giá).</p>
<p>- Thuế VAT (nếu có) = Tổng tiền × Tỷ lệ VAT.</p>
<p>- Tổng thanh toán = Tổng tiền + Thuế VAT.</p>
<p>- Tiền thừa = Tiền khách đưa − Tổng thanh toán.</p>
<p>- Hỗ trợ tiền mặt hoặc chuyển khoản.</p></td>
</tr>
<tr>
<td>2</td>
<td>PV_QĐ1</td>
<td>Quy định đặt bàn</td>
<td><p>- Thời gian đặt trong giờ hoạt động.</p>
<p>- Bàn phải ở trạng thái "Trống".</p>
<p>- Số người ≤ sức chứa tối đa của bàn.</p>
<p>- Ghi nhận: tên khách, SĐT, thời gian, số người.</p>
<p>- Hình thức tiếp nhận đặt bàn gồm: trực tiếp tại nhà hàng hoặc qua điện thoại.</p>
<p>- Nhân viên Phục vụ là người nhập thông tin đặt bàn vào hệ thống; khách hàng không tự thao tác trên phần mềm.</p>
<p>- Khi khách đến: Phục vụ đánh dấu thủ công phiếu đặt "Đã nhận bàn" và đổi trạng thái bàn → "Có khách".</p></td>
</tr>
<tr>
<td>3</td>
<td>B_QĐ1</td>
<td>Quy định chế biến</td>
<td><p>- Bếp nhận phiếu theo thứ tự FIFO.</p>
<p>- Trạng thái: Chờ → Đang chế biến → Đã xong.</p>
<p>- Không bỏ qua bước trạng thái.</p>
<p>- Khi Đã xong → tự động thông báo Phục vụ.</p></td>
</tr>
<tr>
<td>4</td>
<td>K_QĐ1</td>
<td>Quy định nhập/xuất kho</td>
<td><p>- Phiếu nhập: NVL phải có trong danh mục; SL > 0; đơn giá > 0; phải gán nhà cung cấp.</p>
<p>- Phiếu xuất: SL xuất ≤ tồn kho hiện tại.</p>
<p>- Mỗi phiếu phải có người lập; phiếu đã lưu không sửa, chỉ tạo phiếu điều chỉnh.</p>
<p>- Tồn kho cập nhật tức thời sau khi lưu phiếu: Tồn mới = Tồn cũ + Nhập − Xuất.</p>
<p>- Cảnh báo khi tồn ≤ định mức tối thiểu của NVL (cấu hình theo từng NVL).</p></td>
</tr>
<tr>
<td>5</td>
<td>QL_QĐ1</td>
<td>Quy định tài khoản và phân quyền</td>
<td><p>- Mỗi nhân viên có 1 tài khoản, gắn 1 vai trò: Admin / Phục vụ / Bếp / Thu ngân / Kho.</p>
<p>- Mật khẩu: tối thiểu 8 ký tự, có chữ và số; lưu dạng băm (hash), không lưu plaintext.</p>
<p>- Khóa tài khoản sau 5 lần đăng nhập sai liên tiếp; chỉ Admin mở khóa.</p>
<p>- Phiên làm việc tự đăng xuất sau 30 phút không thao tác (hằng số hệ thống).</p>
<p>- Ma trận chức năng ↔ vai trò: hệ thống chặn truy cập chức năng không thuộc vai trò.</p></td>
</tr>
</tbody>
</table>

*Ghi chú:* Các tham số như tỷ lệ VAT (mặc định 10%), giờ hoạt động (08:00–22:00), thời gian phiên (30 phút) được lưu trong tệp hằng số `config/constants.js` của backend — không cấu hình runtime trong phạm vi đồ án.

# 4. BIỂU MẪU LIÊN QUAN {#biểu-mẫu-liên-quan}

### TN_BM1:

**BÁO CÁO DOANH THU**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Số hóa đơn** | **Ngày** | **Bàn** | **Tổng tiền** | **Hình thức TT** |
|---------|----------------|----------|---------|---------------|------------------|
| 1       |                |          |         |               |                  |
| 2       |                |          |         |               |                  |
| \...    |                |          |         |               |                  |

**Tổng doanh thu:** \...\...\...\...\...\...\...\....

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### TN_BM2:

**MÀN HÌNH THANH TOÁN**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thu ngân:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **SL** | **Đơn giá** | **Thành tiền** | **Ghi chú** |
|---------|-------------|--------|-------------|----------------|-------------|
| 1       |             |        |             |                |             |
| 2       |             |        |             |                |             |

**Tổng tiền món:** \...\...\...\...\.....

**Thuế VAT:** \...\...\...\...\.....

**Tổng thanh toán:** \...\...\...\...\.....

**Tiền khách đưa:** \...\...\...\...\.....

**Tiền thừa:** \...\...\...\...\.....

**Hình thức:** \[ \] Tiền mặt \[ \] Chuyển khoản


### TN_BM3:

**HÓA ĐƠN THANH TOÁN**

**NHÀ HÀNG \[TÊN NHÀ HÀNG\]**

**Số HĐ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày giờ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thu ngân:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **SL** | **Đơn giá** | **Thành tiền** |
|---------|-------------|--------|-------------|----------------|
| 1       |             |        |             |                |
| 2       |             |        |             |                |

**Tổng cộng:** \...\...\...\...\.....

**Thuế VAT:** \...\...\...\...\.....

**Tổng thanh toán:** \...\...\...\...\.....

*Cảm ơn Quý khách! Hẹn gặp lại!*


### PV_BM1:

**PHIẾU ĐẶT BÀN**

**Mã đặt bàn:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\..... *(tự phát sinh khi lưu)*

**Tên khách:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**SĐT:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Số người:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Khu vực:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thời gian đặt:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ghi chú:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Hình thức đặt bàn:** \[ \] Trực tiếp \[ \] Qua điện thoại

**Nhân viên tiếp nhận:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Trạng thái đặt bàn:** \[ \] Đã đặt \[ \] Đã nhận bàn \[ \] Đã hủy


### PV_BM2:

**PHIẾU GỌI MÓN / ORDER**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**NV phục vụ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày giờ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **Loại** | **SL** | **Đơn giá** | **Ghi chú** |
|---------|-------------|----------|--------|-------------|-------------|
| 1       |             |          |        |             |             |
| 2       |             |          |        |             |             |
| 3       |             |          |        |             |             |

**Loại:** MA = Món ăn, DU = Đồ uống


### PV_BM3:

**PHIẾU CHUYỂN BẾP**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Số phiếu order:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

*(Chỉ gồm món ăn — đồ uống phục vụ trực tiếp, không qua Bếp.)*

| **STT** | **Tên món** | **SL** | **Ghi chú** | **Trạng thái** |
|---------|-------------|--------|-------------|----------------|
| 1       |             |        |             | Chờ chế biến   |
| 2       |             |        |             | Chờ chế biến   |


### B_BM1:

**PHIẾU ORDER BẾP**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thời gian nhận:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **SL** | **Ghi chú đặc biệt** | **Trạng thái** |
|---------|-------------|--------|----------------------|----------------|
| 1       |             |        |                      | Chờ chế biến   |
| 2       |             |        |                      | Chờ chế biến   |


### B_BM2:

**MÀN HÌNH CẬP NHẬT TRẠNG THÁI MÓN (KITCHEN DISPLAY)**

**Bộ phận:** Bếp

**Nhân viên:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Bàn** | **Tên món** | **SL** | **Ghi chú** | **Thời gian nhận** | **Trạng thái** | **Hành động** |
|---------|---------|-------------|--------|-------------|--------------------|----------------|---------------|
| 1       |         |             |        |             |                    | Chờ chế biến   | \[Bắt đầu\]   |
| 2       |         |             |        |             |                    | Đang chế biến  | \[Hoàn thành\]|

**Bộ lọc:** \[ \] Tất cả \[ \] Chờ \[ \] Đang chế biến \[ \] Đã xong


### PV_BM4:

**XÁC NHẬN PHỤC VỤ MÓN**

**NV phục vụ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thời gian:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Bàn** | **Tên món** | **SL** | **Trạng thái** | **Hành động** |
|---------|---------|-------------|--------|----------------|----------------|
| 1       |         |             |        | Đã xong        | \[Đã phục vụ\] |
| 2       |         |             |        | Đã xong        | \[Đã phục vụ\] |

*Ghi chú: chỉ hiển thị các món có trạng thái "Đã xong" chưa phục vụ.*


### K_BM1:

**PHIẾU NHẬP KHO**

**Số phiếu:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày nhập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Nhà cung cấp:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **SL** | **Đơn giá** | **Thành tiền** | **Ghi chú** |
|---------|-------------|---------|--------|-------------|----------------|-------------|
| 1       |             |         |        |             |                |             |
| 2       |             |         |        |             |                |             |

**Tổng giá trị nhập:** \...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người duyệt:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM2:

**PHIẾU XUẤT KHO**

**Số phiếu:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày xuất:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **SL** | **Đơn giá** | **Thành tiền** | **Ghi chú** |
|---------|-------------|---------|--------|-------------|----------------|-------------|
| 1       |             |         |        |             |                |             |
| 2       |             |         |        |             |                |             |

**Tổng giá trị xuất:** \...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người duyệt:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM3:

**BÁO CÁO TỒN KHO**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **Tồn đầu** | **Nhập** | **Xuất** | **Tồn cuối** | **Ghi chú** |
|----|----|----|----|----|----|----|----|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM4:

**BÁO CÁO NHẬP KHO**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **Tổng SL nhập** | **Tổng giá trị** | **NCC** |
|---------|-------------|---------|------------------|------------------|---------|
| 1       |             |         |                  |                  |         |
| 2       |             |         |                  |                  |         |

**Tổng giá trị nhập kỳ:** \...\...\...\...\.....

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM5:

**BÁO CÁO XUẤT KHO**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **Tổng SL xuất** | **Tổng giá trị** |
|---------|-------------|---------|------------------|------------------|
| 1       |             |         |                  |                  |
| 2       |             |         |                  |                  |

**Tổng giá trị xuất kỳ:** \...\...\...\...\.....

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### QL_BM1:

**MÀN HÌNH QUẢN LÝ THỰC ĐƠN**

**Chức năng:** \[ Thêm \] \[ Sửa \] \[ Xóa \] \[ Tìm kiếm \]

| **STT** | **Tên món** | **Loại món** | **Đơn giá** | **Trạng thái** | **Mô tả** |
|---------|-------------|--------------|-------------|----------------|-----------|
| 1       |             | Món ăn       |             | Còn hàng       |           |
| 2       |             | Đồ uống      |             | Hết hàng       |           |


### QL_BM2:

**MÀN HÌNH QUẢN LÝ BÀN**

**Chức năng:** \[ Thêm \] \[ Sửa \] \[ Xóa \]

| **STT** | **Số bàn** | **Khu vực** | **Sức chứa** | **Trạng thái** | **Ghi chú** |
|---------|------------|-------------|--------------|----------------|-------------|
| 1       |            | Tầng 1      |              | Trống          |             |
| 2       |            | Sân vườn    |              | Có khách       |             |


### QL_BM3:

**MÀN HÌNH QUẢN LÝ TÀI KHOẢN**

**Chức năng:** \[ Thêm \] \[ Sửa \] \[ Khóa/Mở khóa \] \[ Đặt lại mật khẩu \] \[ Tìm kiếm \]

| **STT** | **Mã NV** | **Họ tên** | **Tên đăng nhập** | **Vai trò** | **Trạng thái** | **Ngày tạo** |
|---------|-----------|------------|--------------------|-------------|----------------|--------------|
| 1       |           |            |                    | Phục vụ     | Hoạt động      |              |
| 2       |           |            |                    | Thu ngân    | Đã khóa        |              |

**Vai trò:** Admin / Phục vụ / Bếp / Thu ngân / Kho


### QL_BM4:

**BÁO CÁO TỔNG HỢP (DASHBOARD QUẢN LÝ)**

**Từ ngày:** \...\...\...\...\...\...\...\...\.....  **Đến ngày:** \...\...\...\...\...\...\...\...\.....

**A. Doanh thu**

| **STT** | **Ngày** | **Số hóa đơn** | **Tổng doanh thu** | **Tiền mặt** | **Chuyển khoản** |
|---------|----------|----------------|--------------------|--------------|------------------|
| 1       |          |                |                    |              |                  |

**Tổng doanh thu kỳ:** \...\...\...\...\.....

**B. Top món bán chạy**

| **STT** | **Tên món** | **Số lượng đã bán** | **Doanh thu** |
|---------|-------------|---------------------|---------------|
| 1       |             |                     |               |

**C. Tồn kho cảnh báo (≤ định mức tối thiểu)**

| **STT** | **Tên NVL** | **ĐVT** | **Tồn hiện tại** | **Định mức tối thiểu** |
|---------|-------------|---------|------------------|------------------------|
| 1       |             |         |                  |                        |

**Ngày lập:** \...\...\...\...\...\...\.....  **Người lập:** \...\...\...\...\...\...\.....


### SYS_BM1:

**MÀN HÌNH ĐĂNG NHẬP**

**Tên đăng nhập:** \...\...\...\...\...\...\...\...\.....

**Mật khẩu:** \...\...\...\...\...\...\...\...\.....

\[ Đăng nhập \] \[ Quên mật khẩu \]

*Ghi chú: Sau 5 lần sai liên tiếp → khóa tài khoản. Liên hệ Admin để mở khóa.*

# 5. BẢNG YÊU CẦU CHỨC NĂNG HỆ THỐNG {#bảng-yêu-cầu-chức-năng-hệ-thống}

## 5.1. Danh sách chức năng hệ thống

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Vai trò** | **DFD** |
|----|----|----|----|----|----|----|
| 1 | Đăng nhập / Đăng xuất | Phân quyền | QL_QĐ1. Xác thực tài khoản, tạo phiên làm việc. | SYS_BM1 | Mọi vai trò | §7.6.1 |
| 2 | Quản lý tài khoản | Phân quyền | QL_QĐ1. Tạo/sửa/khóa tài khoản. Phân quyền theo vai trò. | QL_BM3 | Admin | §7.5.3 |

## 5.2. Yêu cầu chung về hệ thống

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 16%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Nội dung</strong></th>
<th style="text-align: center;"><strong>Mô tả chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Phân quyền sử dụng</td>
<td><p>- Admin: quản lý tài khoản, thực đơn, bàn, báo cáo tổng hợp.</p>
<p>- Phục vụ: đặt bàn, gọi món, bàn giao bếp, xác nhận phục vụ món.</p>
<p>- Bếp: nhận phiếu order, cập nhật trạng thái món.</p>
<p>- Thu ngân: thanh toán, xuất hóa đơn, in lại hóa đơn, báo cáo doanh thu.</p>
<p>- Kho: phiếu nhập/xuất kho, báo cáo tồn/nhập/xuất.</p>
<p>- Mọi vai trò: đăng nhập/đăng xuất.</p></td>
</tr>
<tr>
<td>2</td>
<td>Xác thực và phiên làm việc</td>
<td><p>- Đăng nhập bằng tên đăng nhập + mật khẩu (đã băm).</p>
<p>- Mỗi yêu cầu chức năng được kiểm tra quyền theo ma trận vai trò ↔ chức năng.</p>
<p>- Phiên tự đăng xuất sau khoảng thời gian không thao tác (hằng số hệ thống, mặc định 30 phút).</p></td>
</tr>
</tbody>
</table>

# 6. BẢNG YÊU CẦU VỀ CHẤT LƯỢNG HỆ THỐNG {#bảng-yêu-cầu-về-chất-lượng-hệ-thống}

| **STT** | **Nội dung** | **Tiêu chuẩn** | **Mô tả chi tiết** |
|----|----|----|----|
| 1 | Cho phép thay đổi tỷ lệ VAT | Tiến hóa | Admin cấu hình bật/tắt thuế VAT, thay đổi tỷ lệ. |
| 2 | Cấu hình thời gian hủy đặt bàn | Tiến hóa | Thay đổi thời gian chờ (mặc định 15 phút). |
| 3 | Giao diện nhất quán | Tiện dụng | Bố cục, màu sắc, phông chữ đồng nhất. Hỗ trợ phím tắt. |
| 4 | Tốc độ xử lý nhanh | Hiệu quả | Ghi order ≤ 5s. Xuất hóa đơn ≤ 10s. Lập báo cáo ≤ 30s. |
| 5 | Hỗ trợ in phiếu | Tương thích | Tương thích máy in nhiệt 80mm và máy in A4. |
| 6 | Hoạt động ổn định | Tin cậy | Liên tục trong giờ kinh doanh, tự xử lý lỗi kết nối. |
| 7 | Bảo mật xác thực | Bảo mật | Mật khẩu băm (bcrypt/argon2), không lưu plaintext. HTTPS cho mọi giao tiếp. |
| 8 | Chống truy cập trái phép | Bảo mật | Kiểm tra phân quyền ở mỗi API. Khóa tài khoản sau 5 lần sai. Phiên tự hết hạn. |
| 9 | Toàn vẹn dữ liệu giao dịch | Tin cậy | Thanh toán và cập nhật tồn kho dùng transaction (atomic). Rollback nếu lỗi giữa chừng. |

# 7. SƠ ĐỒ LUỒNG DỮ LIỆU CHO TỪNG YÊU CẦU {#sơ-đồ-luồng-dữ-liệu-cho-từng-yêu-cầu}

Phần này trình bày sơ đồ luồng dữ liệu (DFD) cho các yêu cầu chức năng nghiệp vụ chính của hệ thống. Mỗi sơ đồ tuân theo cấu trúc tổng quát gồm 6 luồng dữ liệu (D1--D6), với các thành phần: Người dùng, Khối xử lý, Thiết bị nhập/xuất, và Bộ nhớ phụ (CSDL).

**Ký hiệu tổng quát:**

| **Ký hiệu** | **Ý nghĩa trong thế giới thực** | **Ý nghĩa trong phần mềm** |
|----|----|----|
| Người dùng (hình chữ nhật) | Nhà chuyên môn / Bộ phận | Người thao tác trên phần mềm |
| Khối xử lý (hình elip) | Công việc cần thực hiện | Chức năng phần mềm |
| Luồng dữ liệu (mũi tên) | Thông tin trao đổi | Dữ liệu nhập/xuất |
| Bộ nhớ phụ (hai đường kẻ) | Hồ sơ, sổ sách | Cơ sở dữ liệu |

## 7.1. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Phục vụ {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-phục-vụ}

### 7.1.1. Tiếp nhận đặt bàn (Loại: Lưu trữ) {#tiếp-nhận-đặt-bàn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Tiếp nhận đặt bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin đặt bàn do khách hàng cung cấp trực tiếp hoặc qua điện thoại, được Nhân viên Phục vụ nhập vào hệ thống, gồm: tên khách, SĐT, số người, thời gian đặt, hình thức đặt bàn và bàn được chọn. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách bàn (số bàn, khu vực, sức chứa, trạng thái); giờ hoạt động nhà hàng (hằng số). |
| D4 | Ghi vào CSDL: Thông tin đặt bàn (D1 + mã đặt bàn tự phát sinh, trạng thái = "Đã đặt"). |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Danh sách bàn trống để chọn, kết quả đặt bàn (thành công/thất bại). |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách bàn từ CSDL.
>
> **Bước 2:** Hiển thị D6: danh sách bàn để Phục vụ chọn (kèm trạng thái hiện tại).
>
> **Bước 3:** Nhận D1 từ Phục vụ: tên khách, SĐT, số người, thời gian, bàn được chọn.
>
> **Bước 4:** Kiểm tra quy định PV_QĐ1:
>   - (a) Thời gian đặt nằm trong giờ hoạt động.
>   - (b) Số người ≤ sức chứa của bàn.
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Nếu thỏa → phát sinh mã đặt bàn, ghi D4 vào CSDL Đặt bàn (trạng thái phiếu = "Đã đặt").
>
> **Bước 7:** Hiển thị D6: thông báo đặt bàn thành công, kèm mã đặt bàn.
>
> **Bước 8:** Kết thúc.

*Ghi chú:* Khi khách đến, Phục vụ vào màn "Tiếp nhận đặt bàn", tìm phiếu theo SĐT/mã đặt, bấm "Đã nhận bàn" → hệ thống cập nhật `PhieuDatBan.trang_thai = 'DaNhanBan'` và `Ban.trang_thai = 'CoKhach'` (thao tác đơn giản trên màn quản lý, không tách thành DFD riêng).

### 7.1.2. Ghi nhận gọi món (Loại: Lưu trữ) {#ghi-nhận-gọi-món-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Ghi nhận gọi món**  | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin gọi món do Phục vụ nhập: Bàn số, danh sách món (tên món, số lượng, ghi chú) (dựa vào PV_BM2). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách thực đơn (tên, loại, đơn giá, trạng thái Còn hàng/Hết); **trạng thái hiện tại của bàn** ("Trống" / "Có khách" / "Đã đặt"). |
| D4 | Ghi vào CSDL: Phiếu order (mã order tự phát sinh + D1 + đơn giá tra từ thực đơn). Nếu bàn đang "Trống" (walk-in) → cập nhật trạng thái bàn thành "Có khách". Nếu bàn đã "Có khách" → giữ nguyên. |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Thực đơn để chọn món, kết quả ghi nhận (thành công/thất bại, tổng tạm tính). |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách thực đơn (chỉ các món Còn hàng), thông tin bàn được chọn.
>
> **Bước 2:** Hiển thị D6: thực đơn cho Phục vụ chọn.
>
> **Bước 3:** Nhận D1: Phục vụ chọn bàn, chọn món, nhập số lượng, ghi chú.
>
> **Bước 4:** **Kiểm tra trạng thái bàn**: chỉ chấp nhận nếu bàn = "Trống" (walk-in tự mở bàn) hoặc "Có khách" (đã check-in / đã có order trước đó). Nếu bàn = "Đã đặt" → thông báo lỗi D6 ("Bàn đang giữ chỗ — vui lòng thực hiện check-in trước") → kết thúc.
>
> **Bước 5:** Kiểm tra dữ liệu món: món có trong thực đơn; trạng thái "Còn hàng"; số lượng > 0.
>
> **Bước 6:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 7:** Phát sinh mã order, tra đơn giá từ D3, ghi D4 vào CSDL Phiếu Order.
>
> **Bước 8:** Nếu bàn đang "Trống" → cập nhật trạng thái bàn thành "Có khách" trong CSDL Bàn.
>
> **Bước 9:** Hiển thị D6: thông báo ghi nhận thành công, tổng tạm tính.
>
> **Bước 10:** Kết thúc.

### 7.1.3. Bàn giao cho bếp (Loại: Lưu trữ) {#bàn-giao-cho-bếp-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Bàn giao bếp** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Phục vụ thao tác: lệnh "Chốt order" cho một bàn cụ thể. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Chi tiết phiếu order chưa chuyển (món, loại Món ăn/Đồ uống, SL, ghi chú). |
| D4 | Ghi vào CSDL: Cập nhật trạng thái từng dòng món chưa chuyển và ghi thời gian chốt. Phân theo loại món: **Món ăn → "Chờ chế biến"** (vào hàng chờ Bếp); **Đồ uống → "Đã phục vụ"** ngay (phục vụ tự lấy, không qua Bếp). |
| D5 | Xuất ra máy in (tùy chọn): Phiếu chuyển bếp (PV_BM3) — sinh trên-bay từ data ChiTietOrder các món ăn "Chờ chế biến". |
| D6 | Hiển thị cho Phục vụ: Kết quả chốt order, danh sách món vừa chuyển. |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Phục vụ chọn bàn và bấm "Chốt order".
>
> **Bước 2:** Đọc D3: lấy các dòng món trạng thái "Chưa chốt" của order.
>
> **Bước 3:** Ghi thời gian chốt và cập nhật trạng thái từng dòng (ghi D4): món ăn → "Chờ chế biến"; đồ uống → "Đã phục vụ" ngay.
>
> **Bước 4:** Xuất D5: in phiếu chuyển bếp (PV_BM3) gồm các món ăn, ra máy in Bếp nếu yêu cầu in.
>
> **Bước 5:** Hiển thị D6: thông báo chuyển thành công, số món ăn đã chuyển Bếp và số đồ uống đã phục vụ.
>
> **Bước 6:** Kết thúc.

### 7.1.4. Phục vụ món ra bàn (Loại: Lưu trữ) {#phục-vụ-món-ra-bàn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Phục vụ món ra bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Phục vụ chọn: dòng món cần xác nhận đã phục vụ (theo bàn, mã món). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách các dòng món có trạng thái "Đã xong" nhưng chưa được Phục vụ xác nhận đem ra bàn. |
| D4 | Ghi vào CSDL: Cập nhật trạng thái dòng món → "Đã phục vụ", ghi thời gian phục vụ và mã NV phục vụ. |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Danh sách món "Đã xong" cần phục vụ (PV_BM4); thông báo cập nhật thành công; thông báo realtime khi có món mới sẵn sàng. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: truy vấn các dòng món trạng thái "Đã xong" của các bàn được phân công.
>
> **Bước 2:** Hiển thị D6: danh sách món sẵn sàng phục vụ (PV_BM4).
>
> **Bước 3:** Nhận D1: Phục vụ chọn dòng món và bấm "Đã phục vụ".
>
> **Bước 4:** Kiểm tra: trạng thái hiện tại của dòng món phải là "Đã xong" (tránh cập nhật trùng).
>
> **Bước 5:** Ghi D4: cập nhật trạng thái → "Đã phục vụ", ghi thời gian + mã NV.
>
> **Bước 6:** Hiển thị D6: thông báo thành công, loại dòng món vừa cập nhật khỏi danh sách chờ.
>
> **Bước 7:** Kết thúc.

## 7.2. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Thu ngân {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-thu-ngân}

### 7.2.1. Xử lý thanh toán (Loại: Tính toán) {#xử-lý-thanh-toán-loại-tính-toán}

**Sơ đồ luồng dữ liệu:**

|  | **Thu ngân** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Thanh toán** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Thu ngân nhập: Bàn số cần thanh toán; hình thức thanh toán (tiền mặt/chuyển khoản); **tiền khách đưa (chỉ bắt buộc khi hình thức = tiền mặt)**; mã/ảnh xác nhận giao dịch (tùy chọn khi chuyển khoản). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Chi tiết phiếu order của bàn (tên món, SL, đơn giá, trạng thái). Tỷ lệ VAT lấy từ hằng số hệ thống (mặc định 10%). |
| D4 | Ghi vào CSDL: Kết quả tính toán (tổng tiền, thuế, tổng thanh toán, tiền thừa) → lưu vào CSDL Hóa đơn. Cập nhật trạng thái bàn → \"Trống\". |
| D5 | Xuất ra máy in: Hóa đơn thanh toán (TN_BM3). |
| D6 | Hiển thị cho Thu ngân: Màn hình thanh toán TN_BM2 (danh sách món, tổng tiền, thuế, tổng thanh toán, tiền thừa). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Thu ngân chọn bàn cần thanh toán.
>
> **Bước 2:** Đọc D3: lấy chi tiết order của bàn. Lấy tỷ lệ VAT từ hằng số hệ thống.
>
> **Bước 3:** Kiểm tra quy định TN_QĐ1: tất cả món đã \"Đã phục vụ\" hoặc \"Đã hủy\" chưa?
>
> **Bước 4:** Nếu chưa → thông báo lỗi D6 (\"Còn món chưa phục vụ xong\") → kết thúc.
>
> **Bước 5:** Tính toán theo quy định TN_QĐ1: Tổng tiền = ∑(SL × Đơn giá). Thuế VAT = Tổng tiền × Tỷ lệ VAT. Tổng thanh toán = Tổng tiền + Thuế.
>
> **Bước 6:** Hiển thị D6: màn hình thanh toán (danh sách món, tổng, thuế, tổng thanh toán).
>
> **Bước 7:** Nhận D1 (tiếp): hình thức thanh toán.
>
> **Bước 8:** Phân nhánh theo hình thức:
>   - **(a) Tiền mặt**: nhận tiền khách đưa; tính tiền thừa = Tiền khách đưa − Tổng thanh toán; kiểm tra tiền khách đưa ≥ Tổng thanh toán. Nếu thiếu → thông báo lỗi D6 → quay lại nhận thêm.
>   - **(b) Chuyển khoản**: tiền thừa = 0; Thu ngân xác nhận đã nhận được tiền (có thể đối chiếu mã/ảnh giao dịch — tùy chọn). Nếu chưa nhận được → hủy thao tác.
>
> **Bước 9:** Ghi D4: lưu hóa đơn vào CSDL Hóa đơn (gồm hình thức, tiền khách đưa nếu có, tiền thừa). Cập nhật trạng thái bàn → "Trống".
>
> **Bước 10:** Hiển thị D6: kết quả thanh toán thành công, tiền thừa.
>
> **Bước 11:** Xuất D5: in hóa đơn (TN_BM3) ra máy in.
>
> **Bước 12:** Kết thúc.

### 7.2.2. Lập báo cáo doanh thu (Loại: Kết xuất) {#lập-báo-cáo-doanh-thu-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Thu ngân** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo doanh thu** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Thu ngân nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách hóa đơn đã thanh toán trong kỳ (số HĐ, ngày, bàn, tổng tiền, hình thức TT). |
| D4 | Không có (báo cáo chỉ đọc, không ghi thêm dữ liệu mới). |
| D5 | Xuất ra máy in: Báo cáo doanh thu (TN_BM1). |
| D6 | Hiển thị cho Thu ngân: Bảng báo cáo doanh thu theo biểu mẫu TN_BM1 (danh sách HĐ, tổng doanh thu kỳ). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Thu ngân nhập ngày bắt đầu và ngày kết thúc kỳ báo cáo.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn CSDL Hóa đơn, lấy tất cả hóa đơn đã thanh toán trong khoảng \[ngày bắt đầu, ngày kết thúc\].
>
> **Bước 4:** Tính tổng doanh thu = ∑ (Tổng tiền của từng hóa đơn trong kỳ).
>
> **Bước 5:** Hiển thị D6: báo cáo doanh thu theo biểu mẫu TN_BM1.
>
> **Bước 6:** Xuất D5: in báo cáo ra máy in (nếu Thu ngân yêu cầu).
>
> **Bước 7:** Kết thúc.

### 7.2.3. Xuất / In lại hóa đơn (Loại: Kết xuất) {#xuất-in-lại-hóa-đơn-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Thu ngân** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Xuất / In lại hóa đơn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Thu ngân nhập: Số hóa đơn cần in (hoặc tra theo bàn + ngày), số bản in. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Hóa đơn (tổng tiền, VAT, hình thức TT), chi tiết món của hóa đơn, thông tin nhà hàng (tên, địa chỉ, MST từ CSDL Cấu hình). |
| D4 | Ghi vào CSDL: Ghi log audit (ai in lại, hóa đơn nào, lúc nào, số bản). Không sửa nội dung hóa đơn gốc. |
| D5 | Xuất ra máy in: Hóa đơn thanh toán (TN_BM3) — có thể đánh dấu "BẢN SAO" nếu in lại lần ≥ 2. |
| D6 | Hiển thị cho Thu ngân: Xem trước hóa đơn, kết quả in. |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Thu ngân nhập số hóa đơn (hoặc chọn từ danh sách hóa đơn theo bàn/ngày).
>
> **Bước 2:** Đọc D3: lấy hóa đơn, chi tiết món, thông tin nhà hàng.
>
> **Bước 3:** Nếu không tìm thấy → thông báo lỗi D6 → kết thúc.
>
> **Bước 4:** Hiển thị D6: bản xem trước hóa đơn theo TN_BM3.
>
> **Bước 5:** Thu ngân xác nhận in. Nếu đây là lần in ≥ 2 → đánh dấu "BẢN SAO".
>
> **Bước 6:** Xuất D5: in hóa đơn ra máy in.
>
> **Bước 7:** Ghi D4: lưu log in lại.
>
> **Bước 8:** Kết thúc.

## 7.3. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Bếp {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-bếp}

### 7.3.1. Nhận phiếu order (Loại: Tra cứu) {#nhận-phiếu-order-loại-tra-cứu}

**Sơ đồ luồng dữ liệu:**

|  | **Bộ phận Bếp** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Nhận phiếu order**  | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Lệnh do Bếp thao tác: chọn phiếu cần xem chi tiết / yêu cầu in phiếu. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách phiếu order có trạng thái "Chờ chế biến" (sắp theo thời gian FIFO), chi tiết từng phiếu (bàn, món, SL, ghi chú). |
| D4 | Không có (chức năng chỉ tra cứu, không ghi CSDL). Việc chuyển trạng thái phiếu/món được thực hiện qua chức năng "Cập nhật trạng thái món" (§7.3.2). |
| D5 | Xuất ra máy in: Phiếu order bếp (B_BM1) khi Bếp yêu cầu in. |
| D6 | Hiển thị cho Bếp: Danh sách phiếu order đang chờ và chi tiết từng phiếu. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách phiếu order có trạng thái "Chờ chế biến", sắp theo thứ tự thời gian (FIFO).
>
> **Bước 2:** Hiển thị D6: danh sách phiếu order đang chờ cho Bếp xem.
>
> **Bước 3:** Nhận D1: Bếp chọn phiếu để xem chi tiết hoặc yêu cầu in.
>
> **Bước 4:** Hiển thị D6: chi tiết phiếu được chọn (bàn, các món, SL, ghi chú).
>
> **Bước 5:** Nếu Bếp yêu cầu in → xuất D5: in phiếu order bếp (B_BM1) ra máy in.
>
> **Bước 6:** Kết thúc.

*Ghi chú:* Bếp bắt đầu chế biến bằng cách chuyển trạng thái món sang "Đang chế biến" qua chức năng §7.3.2 — đó chính là dấu hiệu đã nhận phiếu (không cần lưu trữ riêng).

### 7.3.2. Cập nhật trạng thái món (Loại: Lưu trữ) {#cập-nhật-trạng-thái-món-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Bộ phận Bếp** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6|  |
| **Thiết bị nhập** → D2 → | **Xử lý Cập nhật trạng thái món** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Bếp chọn: Món cần cập nhật trạng thái, trạng thái mới (Đang chế biến / Đã xong). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách các món trong phiếu order đã nhận (trạng thái hiện tại của từng món). |
| D4 | Ghi vào CSDL: Cập nhật trạng thái món mới. Nếu \"Đã xong\" → ghi thời gian hoàn thành. |
| D5 | Không có. |
| D6 | Hiển thị cho Bếp: trạng thái cập nhật thành công. Hệ thống tự động gửi thông báo cho Phục vụ khi món \"Đã xong\". |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách món trong các phiếu order đã nhận từ CSDL.
>
> **Bước 2:** Hiển thị D6: danh sách món đang chế biến.
>
> **Bước 3:** Nhận D1: Bếp chọn món, chọn trạng thái mới.
>
> **Bước 4:** Kiểm tra quy định B_QĐ1: trạng thái phải chuyển tuần tự (Chờ → Đang chế biến → Đã xong). Không được bỏ bước.
>
> **Bước 5:** Nếu vi phạm thứ tự → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: cập nhật trạng thái món trong CSDL Phiếu Order.
>
> **Bước 7:** Nếu trạng thái mới = \"Đã xong\" → hệ thống tự động gửi thông báo D6 cho Nhân viên Phục vụ.
>
> **Bước 8:** Kết thúc.

## 7.4. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Kho {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-kho}

### 7.4.1. Lập phiếu nhập kho (Loại: Lưu trữ) {#lập-phiếu-nhập-kho-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập phiếu nhập kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày nhập, nhà cung cấp, danh sách NVL (tên, ĐVT, SL, đơn giá) (dựa vào K_BM1). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh mục NVL (để chọn), danh sách nhà cung cấp, số liệu tồn kho hiện tại. |
| D4 | Ghi vào CSDL: Phiếu nhập kho (mã phiếu tự phát sinh + D1 + tổng giá trị nhập). Cập nhật tồn kho: Tồn mới = Tồn cũ + SL nhập. |
| D5 | Xuất ra máy in: Phiếu nhập kho (K_BM1). |
| D6 | Hiển thị cho NV Kho: Danh mục NVL, NCC để chọn. Kết quả lưu thành công, tổng giá trị nhập. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh mục NVL, danh sách NCC từ CSDL.
>
> **Bước 2:** Hiển thị D6: danh mục NVL, NCC cho NV Kho chọn.
>
> **Bước 3:** Nhận D1: NV Kho nhập ngày, chọn NCC, chọn NVL, nhập SL, đơn giá.
>
> **Bước 4:** Kiểm tra: SL \> 0, đơn giá \> 0.
>
> **Bước 5:** Tính tổng giá trị nhập = ∑(SL × Đơn giá).
>
> **Bước 6:** Phát sinh mã phiếu, ghi D4: lưu phiếu nhập vào CSDL.
>
> **Bước 7:** Cập nhật tồn kho: Tồn mới = Tồn cũ + SL nhập.
>
> **Bước 8:** Hiển thị D6: thông báo thành công, tổng giá trị nhập.
>
> **Bước 9:** Xuất D5: in phiếu nhập kho (K_BM1) nếu cần.
>
> **Bước 10:** Kết thúc.

### 7.4.2. Báo cáo tồn kho (Loại: Kết xuất) {#báo-cáo-tồn-kho-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo tồn kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tồn đầu kỳ từng NVL, tổng SL nhập trong kỳ, tổng SL xuất trong kỳ (truy vấn CSDL Kho). |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo tồn kho (K_BM3). |
| D6 | Hiển thị cho NV Kho: Bảng báo cáo tồn kho theo K_BM3 (tồn đầu, nhập, xuất, tồn cuối từng NVL). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: NV Kho nhập khoảng thời gian báo cáo.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn CSDL, tính tồn đầu kỳ, tổng nhập, tổng xuất cho từng NVL.
>
> **Bước 4:** Tính tồn cuối kỳ = Tồn đầu kỳ + Nhập trong kỳ − Xuất trong kỳ (cho từng NVL).
>
> **Bước 5:** Hiển thị D6: báo cáo tồn kho theo biểu mẫu K_BM3.
>
> **Bước 6:** Xuất D5: in báo cáo (K_BM3) ra máy in nếu NV Kho yêu cầu.
>
> **Bước 7:** Kết thúc.

### 7.4.3. Lập phiếu xuất kho (Loại: Lưu trữ) {#lập-phiếu-xuất-kho-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập phiếu xuất kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày xuất, danh sách NVL (tên, ĐVT, SL, đơn giá), ghi chú (dựa vào K_BM2). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh mục NVL, tồn kho hiện tại của từng NVL. |
| D4 | Ghi vào CSDL: Phiếu xuất kho (mã phiếu tự phát sinh + D1 + tổng giá trị xuất). Cập nhật tồn kho: Tồn mới = Tồn cũ − SL xuất. |
| D5 | Xuất ra máy in: Phiếu xuất kho (K_BM2). |
| D6 | Hiển thị cho NV Kho: Danh mục NVL kèm tồn hiện tại để chọn. Kết quả lưu thành công, tổng giá trị xuất. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh mục NVL + tồn hiện tại.
>
> **Bước 2:** Hiển thị D6: danh mục NVL + tồn cho NV Kho chọn.
>
> **Bước 3:** Nhận D1: NV Kho nhập ngày, chọn NVL, nhập SL, đơn giá.
>
> **Bước 4:** Kiểm tra quy định K_QĐ1: SL > 0; đơn giá > 0; SL xuất ≤ tồn hiện tại.
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Tính tổng giá trị xuất = ∑(SL × Đơn giá).
>
> **Bước 7:** Phát sinh mã phiếu, ghi D4: lưu phiếu xuất vào CSDL trong 1 transaction.
>
> **Bước 8:** Cập nhật tồn kho: Tồn mới = Tồn cũ − SL xuất (cùng transaction). Nếu tồn mới ≤ định mức tối thiểu → đánh dấu cảnh báo.
>
> **Bước 9:** Hiển thị D6: thông báo thành công, tổng giá trị xuất, cảnh báo tồn thấp (nếu có).
>
> **Bước 10:** Xuất D5: in phiếu xuất kho (K_BM2) nếu cần.
>
> **Bước 11:** Kết thúc.

### 7.4.4. Báo cáo nhập kho (Loại: Kết xuất) {#báo-cáo-nhập-kho-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo nhập kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. Tùy chọn lọc theo NCC. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tất cả phiếu nhập kho trong khoảng thời gian, chi tiết NVL từng phiếu, danh sách NCC. |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo nhập kho (K_BM4). |
| D6 | Hiển thị cho NV Kho: Bảng báo cáo K_BM4 (NVL, tổng SL nhập, tổng giá trị, NCC). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: NV Kho nhập khoảng thời gian (và NCC nếu có).
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn các phiếu nhập trong khoảng [BĐ, KT] (lọc theo NCC nếu có).
>
> **Bước 4:** Tổng hợp theo NVL: tổng SL nhập, tổng giá trị nhập, NCC chính.
>
> **Bước 5:** Tính tổng giá trị nhập kỳ = ∑ (tổng giá trị từng NVL).
>
> **Bước 6:** Hiển thị D6: báo cáo theo K_BM4.
>
> **Bước 7:** Xuất D5: in K_BM4 nếu NV Kho yêu cầu.
>
> **Bước 8:** Kết thúc.

### 7.4.5. Báo cáo xuất kho (Loại: Kết xuất) {#báo-cáo-xuất-kho-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo xuất kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tất cả phiếu xuất kho trong khoảng thời gian, chi tiết NVL từng phiếu. |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo xuất kho (K_BM5). |
| D6 | Hiển thị cho NV Kho: Bảng báo cáo K_BM5 (NVL, tổng SL xuất, tổng giá trị). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: NV Kho nhập khoảng thời gian.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn phiếu xuất trong khoảng [BĐ, KT].
>
> **Bước 4:** Tổng hợp theo NVL: tổng SL xuất, tổng giá trị xuất.
>
> **Bước 5:** Tính tổng giá trị xuất kỳ = ∑ (tổng giá trị từng NVL).
>
> **Bước 6:** Hiển thị D6: báo cáo theo K_BM5.
>
> **Bước 7:** Xuất D5: in K_BM5 nếu yêu cầu.
>
> **Bước 8:** Kết thúc.

## 7.5. Sơ đồ luồng dữ liệu các yêu cầu Quản lý (Admin) {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-quản-lý-admin}

### 7.5.1. Quản lý thực đơn (Loại: Lưu trữ) {#quản-lý-thực-đơn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Quản lý thực đơn**  | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Tên món, loại món (Món ăn/Đồ uống), đơn giá, mô tả, trạng thái (Còn hàng/Hết hàng) (dựa vào QL_BM1). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách thực đơn hiện tại (để hiển thị, tìm kiếm, kiểm tra trùng lặp). |
| D4 | Ghi vào CSDL: Thêm món mới / Cập nhật thông tin món / Xóa món (đánh dấu ngừng kinh doanh). |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Danh sách thực đơn, kết quả thao tác (thêm/sửa/xóa thành công hay thất bại). |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách thực đơn hiện tại từ CSDL.
>
> **Bước 2:** Hiển thị D6: bảng thực đơn theo QL_BM1, các nút chức năng (Thêm/Sửa/Xóa/Tìm kiếm).
>
> **Bước 3:** Nhận D1: Admin thao tác thêm/sửa/xóa món.
>
> **Bước 4:** Kiểm tra: tên món không trùng (khi thêm mới), đơn giá \> 0, loại món hợp lệ.
>
> **Bước 5:** Nếu không hợp lệ → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: thực hiện thao tác tương ứng trên CSDL Thực đơn.
>
> **Bước 7:** Hiển thị D6: thông báo thành công, cập nhật lại danh sách.
>
> **Bước 8:** Kết thúc.

### 7.5.2. Quản lý bàn (Loại: Lưu trữ) {#quản-lý-bàn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Quản lý bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Số bàn, khu vực, sức chứa, ghi chú; lệnh thêm/sửa/xóa (dựa vào QL_BM2). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách bàn hiện tại + trạng thái (Trống/Có khách/Đã đặt). |
| D4 | Ghi vào CSDL: Thêm bàn / cập nhật / xóa (đánh dấu ngừng sử dụng). Không xóa cứng nếu bàn đang có khách hoặc đã đặt. |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Bảng danh sách bàn (QL_BM2); kết quả thao tác. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách bàn từ CSDL.
>
> **Bước 2:** Hiển thị D6: bảng bàn theo QL_BM2.
>
> **Bước 3:** Nhận D1: Admin thao tác thêm/sửa/xóa.
>
> **Bước 4:** Kiểm tra: số bàn không trùng (khi thêm); sức chứa > 0; khi xóa → bàn phải ở trạng thái "Trống".
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: thực hiện thao tác trên CSDL Bàn.
>
> **Bước 7:** Hiển thị D6: thông báo thành công.
>
> **Bước 8:** Kết thúc.

### 7.5.3. Quản lý tài khoản (Loại: Phân quyền) {#quản-lý-tài-khoản-loại-phân-quyền}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Quản lý tài khoản** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Họ tên, tên đăng nhập, mật khẩu khởi tạo, vai trò; lệnh thêm/sửa/khóa/mở khóa/đặt lại mật khẩu (dựa vào QL_BM3). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách tài khoản hiện có, danh mục vai trò, ma trận phân quyền. |
| D4 | Ghi vào CSDL: Thêm/sửa tài khoản (mật khẩu hash), khóa/mở khóa, đặt lại mật khẩu. |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Danh sách tài khoản (QL_BM3); kết quả thao tác. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách tài khoản và vai trò từ CSDL.
>
> **Bước 2:** Hiển thị D6: bảng QL_BM3 và các nút chức năng.
>
> **Bước 3:** Nhận D1: Admin thao tác.
>
> **Bước 4:** Kiểm tra quy định QL_QĐ1: tên đăng nhập không trùng; mật khẩu ≥ 8 ký tự + có chữ và số; vai trò hợp lệ; không cho phép Admin tự khóa chính mình.
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Băm mật khẩu (nếu có), ghi D4 vào CSDL Tài khoản.
>
> **Bước 7:** Hiển thị D6: thông báo thành công.
>
> **Bước 8:** Kết thúc.

### 7.5.4. Xem báo cáo tổng hợp (Loại: Kết xuất) {#xem-báo-cáo-tổng-hợp-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo tổng hợp** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Khoảng thời gian báo cáo, các mục cần xem (doanh thu / top món / cảnh báo tồn / nhập-xuất). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Hóa đơn, chi tiết order, phiếu nhập, phiếu xuất, tồn kho hiện tại, định mức tối thiểu. |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo tổng hợp (QL_BM4). |
| D6 | Hiển thị cho Admin: Dashboard QL_BM4 với 3 phần (doanh thu, top món, cảnh báo tồn). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Admin nhập kỳ báo cáo và chọn mục.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3 — phần A (Doanh thu): tổng hợp hóa đơn theo ngày + theo hình thức thanh toán.
>
> **Bước 4:** Đọc D3 — phần B (Top món): tổng hợp số lượng bán + doanh thu theo món, sắp giảm dần, lấy top N.
>
> **Bước 5:** Đọc D3 — phần C (Cảnh báo tồn): lọc NVL có tồn ≤ định mức tối thiểu.
>
> **Bước 6:** Hiển thị D6: QL_BM4 đầy đủ 3 phần.
>
> **Bước 7:** Xuất D5: in nếu Admin yêu cầu.
>
> **Bước 8:** Kết thúc.

## 7.6. Sơ đồ luồng dữ liệu các chức năng hệ thống {#sơ-đồ-luồng-dữ-liệu-các-chức-năng-hệ-thống}

### 7.6.1. Đăng nhập / Đăng xuất (Loại: Phân quyền) {#đăng-nhập-đăng-xuất-loại-phân-quyền}

**Sơ đồ luồng dữ liệu:**

|  | **Người dùng (mọi vai trò)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Đăng nhập / Đăng xuất** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Người dùng nhập: Tên đăng nhập + mật khẩu (đăng nhập); hoặc lệnh "Đăng xuất". |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tài khoản theo tên đăng nhập (trạng thái, hash mật khẩu, số lần sai liên tiếp, vai trò). Thời gian phiên lấy từ hằng số hệ thống. |
| D4 | Ghi vào CSDL: Tăng/đặt lại số lần sai; khóa tài khoản nếu sai ≥ 5; cập nhật thời gian đăng nhập gần nhất. Token JWT được tạo và trả về client, không lưu phía server. |
| D5 | Không có. |
| D6 | Hiển thị cho Người dùng: Màn hình đăng nhập SYS_BM1; kết quả đăng nhập (thành công → mở giao diện theo vai trò; thất bại → thông báo lỗi); kết quả đăng xuất. |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: tên đăng nhập + mật khẩu (hoặc lệnh "Đăng xuất").
>
> **Bước 2 (Đăng nhập):** Đọc D3: tài khoản theo tên đăng nhập.
>
> **Bước 3:** Nếu không tồn tại HOẶC trạng thái "Đã khóa" → thông báo lỗi D6 → kết thúc.
>
> **Bước 4:** So khớp mật khẩu (hash). Nếu sai → ghi D4 (tăng số lần sai); nếu lần sai ≥ 5 → khóa tài khoản; thông báo lỗi D6 → kết thúc.
>
> **Bước 5:** Nếu đúng → ghi D4: reset số lần sai, cập nhật thời gian đăng nhập. Tạo JWT (payload: `ma_nguoi_dung`, `ma_vai_tro`; hạn = giờ hiện tại + thời gian phiên).
>
> **Bước 6:** Hiển thị D6: mở giao diện theo vai trò, lưu JWT ở client (localStorage).
>
> **Bước 7 (Đăng xuất):** Client xóa JWT khỏi localStorage. Hiển thị D6: về màn hình đăng nhập.
>
> **Bước 8:** Kết thúc.

*Ghi chú:* JWT stateless — không có bảng phiên đăng nhập phía server. Đăng xuất chỉ cần client xóa token; nếu cần thu hồi sớm trước hạn token (vd Admin khóa tài khoản), middleware xác thực kiểm tra lại `NguoiDung.trang_thai` mỗi request.
