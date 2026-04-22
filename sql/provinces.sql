-- 中国省份代码表
-- 包含省份编码、中文名称和简码

CREATE TABLE IF NOT EXISTS `provinces` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
  `province_code` VARCHAR(10) UNIQUE NOT NULL COMMENT '省份代码(如JSU、GDN)',
  `province_name` VARCHAR(50) NOT NULL COMMENT '中文省份名称',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='省份编码表';

-- 国内省份数据
INSERT INTO `provinces` (`province_code`, `province_name`) VALUES
('AHI', '安徽'),
('FJN', '福建'),
('GDN', '广东'),
('GDS', '甘肃'),
('GSU', '贵州'),
('GXI', '广西'),
('GZU', '贵州'),
('HAN', '河南'),
('HBI', '湖北'),
('HEB', '河北'),
('HEN', '河南'),
('HKG', '香港'),
('HLJ', '黑龙江'),
('HNN', '湖南'),
('JLN', '吉林'),
('JSU', '江苏'),
('JXI', '江西'),
('LNG', '辽宁'),
('MAC', '澳门'),
('MGZ', '玛瑙州'),
('NMG', '内蒙古'),
('NXA', '宁夏'),
('QHI', '青海'),
('SCN', '四川'),
('SDG', '山东'),
('SHA', '上海'),
('SHX', '陕西'),
('SUM', '苏门答腊'),
('SXI', '陕西'),
('SYX', '山西'),
('SZX', '深圳'),
('TSN', '天津'),
('TWN', '台湾'),
('XJG', '新疆'),
('XZG', '西藏'),
('YNN', '云南'),
('ZJG', '浙江'),
-- 国外区域
('BAK', '泰国'),
('CAS', '新西兰'),
('DCA', '美国'),
('INA', '印度尼西亚'),
('NSW', '澳大利亚');
