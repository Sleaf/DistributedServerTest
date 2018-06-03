CREATE DATABASE IF NOT EXISTS Users
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE Users;

#echo "default-time_zone = '+8:00'" >> /etc/mysql/my.cnf

SET GLOBAL time_zone = '+8:00';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS accounts (
  identification int auto_increment primary key,
  username       CHAR(32) unique,
  password       CHAR(32)
);
