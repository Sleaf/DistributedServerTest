CREATE DATABASE IF NOT EXISTS NTMTrip
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE NTMTrip;

#echo "default-time_zone = '+8:00'" >> /etc/mysql/my.cnf

SET GLOBAL time_zone = '+8:00';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS accounts (
  user_id  int auto_increment primary key,
  username CHAR(32) unique,
  password CHAR(32)
);

CREATE TABLE IF NOT EXISTS flight_brand (
  brand_id   int auto_increment primary key,
  brand_name varchar(32) not null

);

CREATE TABLE IF NOT EXISTS flights (
  flight_id varchar(64) primary key,
  tripDate  DATE        not null,
  tripTime  time       not null,
  model     varchar(32) not null,
  brand_id  int         not null,
  terminal  varchar(32) not null,
  departure varchar(32) not null,
   rest int
  FOREIGN KEY (brand_id) REFERENCES flight_brand(brand_id)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id int auto_increment primary key
);
