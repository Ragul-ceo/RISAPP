-- Create Database
CREATE DATABASE IF NOT EXISTS risapp_db;
USE risapp_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('employee', 'hr', 'admin') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  check_in_time TIMESTAMP,
  check_in_latitude DECIMAL(10, 8),
  check_in_longitude DECIMAL(11, 8),
  check_out_time TIMESTAMP NULL,
  check_out_latitude DECIMAL(10, 8),
  check_out_longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(user_id, check_in_time)
);

-- Insert Sample HR User
INSERT INTO users (name, email, password, role) VALUES 
('HR Admin', 'hr@raminfosys.com', '$2a$10$YourHashedPasswordHere', 'hr');

-- Insert Sample Employee User
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'john@raminfosys.com', '$2a$10$YourHashedPasswordHere', 'employee');
