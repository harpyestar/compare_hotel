# 数据库工具脚本

本目录包含用于数据库管理和维护的工具脚本。

## 脚本说明

### import-hotel-data.js
用于初始化数据库并导入酒店数据。

**功能：**
- 创建数据库表结构（provinces、hotel_info）
- 导入省份数据
- 从SQL文件导入酒店数据
- 验证导入结果

**使用方法：**
```bash
node scripts/import-hotel-data.js
```

**注意事项：**
- 会清空现有的酒店数据和省份数据
- 需要确保`sql/hotel_info.sql`文件存在
- 数据库文件保存在`data/hotel_search.db`

### verify-hotel-data.js
用于验证数据库中的酒店数据。

**功能：**
- 检查数据库文件是否存在
- 验证省份表数据
- 验证酒店表数据
- 显示按城市和省份的统计信息
- 显示表结构信息

**使用方法：**
```bash
node scripts/verify-hotel-data.js
```

**输出内容：**
- 省份表记录数和示例数据
- 酒店表记录数
- 按城市统计的酒店数量（前20个城市）
- 按省份统计的酒店数量
- 酒店示例数据
- 表结构信息

## 数据库结构

### provinces 表
- `id`: 主键
- `province_code`: 省份代码（唯一）
- `province_name`: 省份名称
- `created_at`: 创建时间

### hotel_info 表
- `id`: 主键
- `hotel_id`: 酒店ID（唯一）
- `chn_name3`: 酒店中文名称
- `province`: 省份代码
- `city_name`: 城市名称
- `chn_address`: 中文地址
- `pet_text`: 宠物政策
- `lng_baidu`: 百度经度
- `lat_baidu`: 百度纬度
- `created_at`: 创建时间

## 常见问题

1. **数据库文件不存在**
   - 运行`import-hotel-data.js`来创建和初始化数据库

2. **数据导入失败**
   - 检查`sql/hotel_info.sql`文件是否存在
   - 确保SQL文件格式正确

3. **验证数据显示异常**
   - 运行`verify-hotel-data.js`检查数据完整性
   - 如果数据不完整，重新运行`import-hotel-data.js`

## 注意事项

- 这些脚本需要在Node.js环境下运行
- 需要安装依赖：`sql.js`
- 运行前请确保没有其他程序正在使用数据库文件
- 建议在运行导入脚本前备份现有数据库
