CREATE DATABASE IF NOT EXISTS NTMBoeing
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE NTMBoeing;

#echo "default-time_zone = '+8:00'" >> /etc/mysql/my.cnf

SET GLOBAL time_zone = '+8:00';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS accounts (
  user_id  int auto_increment primary key,
  username CHAR(32) unique,
  password CHAR(32)
);


CREATE TABLE IF NOT EXISTS flights (
  flight_id int auto_increment primary key,
  tripDate  DATE        not null,
  tripTime  time       not null,
  model     varchar(32) not null,
  departure varchar(32) not null,
  terminal  varchar(32) not null,
  price int not null,
  restTickets int
);