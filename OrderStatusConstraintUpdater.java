package com.finalproject2;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Tự động cập nhật CHECK constraint cho cột status bảng Orders
 * mỗi khi Spring Boot khởi động. Không cần chạy SQL tay.
 */
@Component
public class OrderStatusConstraintUpdater implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    public OrderStatusConstraintUpdater(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        try {
            // 1. Xóa tất cả CHECK constraint cũ trên cột status
            jdbc.execute("""
                DECLARE @sql NVARCHAR(MAX) = '';
                SELECT @sql = @sql + 'ALTER TABLE Orders DROP CONSTRAINT ' + QUOTENAME(cc.name) + '; '
                FROM sys.check_constraints cc
                WHERE cc.parent_object_id = OBJECT_ID('Orders')
                  AND cc.definition LIKE '%status%';
                IF @sql <> '' EXEC sp_executesql @sql;
            """);

            // 2. Tạo lại constraint MỚI (bao gồm DAMAGED, LOST, RETURN_APPROVED)
            jdbc.execute("""
                ALTER TABLE Orders ADD CONSTRAINT CK_Orders_Status
                CHECK (status IN ('NEW','CONFIRMED','SHIPPING','SUCCESS','CANCELLED',
                                  'RETURN_REQUEST','RETURN_APPROVED','RETURNING','RETURNED',
                                  'DAMAGED','LOST','PENDING','PROCESSING',
                                  'DELIVERING','DELIVERED'))
            """);

            System.out.println("[OK] Da cap nhat CHECK constraint Orders.status thanh cong!");
        } catch (Exception e) {
            System.out.println("[WARN] Khong cap nhat duoc constraint Orders.status: " + e.getMessage());
        }
    }
}
