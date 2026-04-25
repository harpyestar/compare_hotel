-- 创建数据库
CREATE DATABASE IF NOT EXISTS hotel_search;

-- 使用数据库
USE hotel_search;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- 创建搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- 创建收藏酒店表
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    hotel_id VARCHAR(50) NOT NULL,
    hotel_name VARCHAR(100) NOT NULL,
    hotel_address VARCHAR(200) NOT NULL,
    hotel_price INT NOT NULL,
    hotel_image VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_hotel (username, hotel_id),
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- 创建价格详情表
CREATE TABLE IF NOT EXISTS price_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,1) NOT NULL
);

-- 创建城市表
CREATE TABLE IF NOT EXISTS city (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    province_id INT NOT NULL,
    city_name VARCHAR(50) NOT NULL,
    city_latitude DECIMAL(10,6) NOT NULL,
    city_longitude DECIMAL(10,6) NOT NULL
);

-- 创建省份表
CREATE TABLE IF NOT EXISTS provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    province_code VARCHAR(10) UNIQUE NOT NULL,
    province_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);