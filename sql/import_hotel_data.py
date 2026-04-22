#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
酒店信息数据导入脚本
功能：分批导入SQL文件中的酒店信息到MySQL数据库
"""

import sys
import time
import pymysql
from pathlib import Path

# 配置参数
SQL_FILE_PATH = Path("sql/hotel_info.sql")
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "hotel_search",
    "charset": "utf8mb4"
}
BATCH_SIZE = 1000  # 每批处理的SQL语句数


def count_total_lines(file_path):
    """统计文件总行数"""
    count = 0
    # 使用二进制模式读取，然后解码
    with open(file_path, 'rb') as f:
        for _ in f:
            count += 1
    return count


def import_data():
    """主导入函数"""
    print("=" * 60)
    print("酒店信息数据导入工具")
    print("=" * 60)
    print(f"SQL文件: {SQL_FILE_PATH}")
    print(f"数据库: {DB_CONFIG['database']}")
    print(f"批次大小: {BATCH_SIZE} 条")
    print("=" * 60)
    
    # 检查文件是否存在
    if not SQL_FILE_PATH.exists():
        print(f"错误: 文件不存在 - {SQL_FILE_PATH}")
        sys.exit(1)
    
    # 统计总行数
    print("\n正在统计文件行数...")
    total_lines = count_total_lines(SQL_FILE_PATH)
    print(f"文件总行数: {total_lines:,}")
    
    # 连接数据库
    print("\n正在连接数据库...")
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("数据库连接成功!")
    except Exception as e:
        print(f"数据库连接失败: {e}")
        sys.exit(1)
    
    # 检查表是否存在，不存在则创建
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS hotel_info (
            HOTELID VARCHAR(20) PRIMARY KEY,
            CHN_NAME3 VARCHAR(255) NOT NULL,
            PROVINCE VARCHAR(50),
            CITY_NAME VARCHAR(50),
            CHN_ADDRESS VARCHAR(500),
            PET_TEXT VARCHAR(255),
            LNG_BAIDU VARCHAR(50),
            LAT_BAIDU VARCHAR(50)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)
    conn.commit()
    print("表结构检查完成")
    
    # 清空表（可选，如果需要增量导入请注释掉）
    cursor.execute("TRUNCATE TABLE hotel_info")
    conn.commit()
    print("已清空现有数据")
    
    # 开始导入
    print("\n" + "=" * 60)
    print("开始导入数据...")
    print("=" * 60)
    
    batch_sql = []
    processed_lines = 0
    success_count = 0
    error_count = 0
    batch_count = 0
    start_time = time.time()
    
    try:
        # 使用二进制模式读取文件
        with open(SQL_FILE_PATH, 'rb') as f:
            for line_num, line in enumerate(f, 1):
                processed_lines += 1
                
                # 尝试多种编码解码
                for encoding in ['utf-8', 'gbk', 'gb2312', 'latin1']:
                    try:
                        line = line.decode(encoding)
                        break
                    except UnicodeDecodeError:
                        continue
                else:
                    # 所有编码都失败，跳过该行
                    print(f"警告: 第 {line_num} 行无法解码，跳过")
                    continue
                
                # 跳过空行和注释
                line = line.strip()
                if not line or line.startswith('--') or line.startswith('/*'):
                    continue
                
                # 将双引号替换为反引号（MySQL语法）
                sql_line = line.replace('"', '`')
                batch_sql.append(sql_line)
                
                # 批量执行
                if len(batch_sql) >= BATCH_SIZE:
                    batch_count += 1
                    try:
                        for sql in batch_sql:
                            cursor.execute(sql)
                        conn.commit()
                        success_count += len(batch_sql)
                        
                        # 显示进度
                        progress = (processed_lines / total_lines) * 100
                        elapsed = time.time() - start_time
                        speed = success_count / elapsed if elapsed > 0 else 0
                        
                        print(f"批次 {batch_count}: 已导入 {success_count:,} 条 | "
                              f"进度: {progress:.1f}% | "
                              f"速度: {speed:.0f} 条/秒")
                        
                    except Exception as e:
                        print(f"错误: 批次 {batch_count} 导入失败: {e}")
                        error_count += len(batch_sql)
                        conn.rollback()
                    
                    batch_sql = []
        
        # 处理剩余数据
        if batch_sql:
            batch_count += 1
            try:
                for sql in batch_sql:
                    cursor.execute(sql)
                conn.commit()
                success_count += len(batch_sql)
                print(f"批次 {batch_count}: 已导入 {success_count:,} 条 (最后一批)")
            except Exception as e:
                print(f"错误: 最后批次导入失败: {e}")
                error_count += len(batch_sql)
                conn.rollback()
    
    except KeyboardInterrupt:
        print("\n\n用户中断导入")
    
    finally:
        # 关闭连接
        cursor.close()
        conn.close()
        
        # 显示统计信息
        elapsed = time.time() - start_time
        print("\n" + "=" * 60)
        print("导入完成!")
        print("=" * 60)
        print(f"总耗时: {elapsed:.2f} 秒")
        print(f"成功导入: {success_count:,} 条")
        print(f"失败数量: {error_count:,} 条")
        print(f"平均速度: {success_count/elapsed:.0f} 条/秒" if elapsed > 0 else "N/A")
        print("=" * 60)


if __name__ == "__main__":
    try:
        import pymysql
    except ImportError:
        print("错误: 缺少 pymysql 模块")
        print("请运行: pip install pymysql")
        sys.exit(1)
    
    import_data()
