-- 1. Thêm cột return_images (lưu JSON mảng URL ảnh hoàn hàng)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Orders') AND name = 'return_images')
BEGIN
    ALTER TABLE Orders ADD return_images NVARCHAR(MAX);
END
GO

-- 2. Xóa CHECK constraint cũ trên cột status
DECLARE @ConstraintName NVARCHAR(200);
DECLARE @Sql NVARCHAR(MAX) = '';

SELECT @ConstraintName = cc.name 
FROM sys.check_constraints cc
JOIN sys.columns c ON cc.parent_object_id = c.object_id AND cc.parent_column_id = c.column_id
WHERE cc.parent_object_id = OBJECT_ID('Orders') AND c.name = 'status';

IF @ConstraintName IS NULL
BEGIN
    SELECT TOP 1 @ConstraintName = cc.name
    FROM sys.check_constraints cc
    WHERE cc.parent_object_id = OBJECT_ID('Orders') AND cc.definition LIKE '%status%';
END

IF @ConstraintName IS NOT NULL
BEGIN
    SET @Sql = 'ALTER TABLE Orders DROP CONSTRAINT ' + QUOTENAME(@ConstraintName) + ';';
    EXEC sp_executesql @Sql;
END
GO

IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Orders_Status' AND parent_object_id = OBJECT_ID('Orders'))
BEGIN
    ALTER TABLE Orders DROP CONSTRAINT CK_Orders_Status;
END
GO

-- 3. Tạo lại constraint MỚI (thêm DAMAGED, LOST)
ALTER TABLE Orders ADD CONSTRAINT CK_Orders_Status 
    CHECK (status IN ('NEW','CONFIRMED','SHIPPING','SUCCESS','CANCELLED','RETURN_REQUEST','RETURNING','RETURNED','DAMAGED','LOST'));
GO
