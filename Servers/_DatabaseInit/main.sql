CREATE DATABASE IF NOT EXISTS NTMTrip
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE NTMTrip;

CREATE TABLE IF NOT EXISTS accounts (
  user_id  INT AUTO_INCREMENT PRIMARY KEY,
  username CHAR(32) UNIQUE NOT NULL,
  password CHAR(32)        NOT NULL,
  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flight_brand (
  brand_id   INT AUTO_INCREMENT PRIMARY KEY,
  brand_name VARCHAR(32)   NOT NULL,
  brand_url  VARCHAR(1024) NOT NULL
);

CREATE TABLE IF NOT EXISTS flights (
  flight_id   VARCHAR(64) PRIMARY KEY,
  tripDate    DATE        NOT NULL,
  tripTime    TIME        NOT NULL,
  model       VARCHAR(32) NOT NULL,
  brand_id    INT         NOT NULL,
  departure   VARCHAR(32) NOT NULL,
  terminal    VARCHAR(32) NOT NULL,
  price       INT         NOT NULL,
  restTickets INT
  FOREIGN KEY (brand_id) REFERENCES flight_brand(brand_id)
);

CREATE TABLE IF NOT EXISTS orders (
  orders_id    VARCHAR(64) PRIMARY KEY,
  user_id     INT  ,
  flight_id VARCHAR(64),
  price        INT      NOT NULL,
  status VARCHAR (32) not null,
  msg VARCHAR (1024),
  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES accounts(user_id),
  FOREIGN KEY (brand_id) REFERENCES flight_brand(brand_id)
);