CREATE DATABASE IF NOT EXISTS NTMBoeing
  DEFAULT CHARSET utf8mb4
  COLLATE utf8mb4_general_ci;

USE NTMBoeing;

CREATE TABLE IF NOT EXISTS accounts (
  username CHAR(32) UNIQUE NOT NULL,
  password CHAR(32)        NOT NULL,
  user_id  INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS flights (
  tripDate     DATE        NOT NULL,
  tripTime     TIME        NOT NULL,
  model        VARCHAR(32) NOT NULL,
  departure    VARCHAR(32) NOT NULL,
  terminal     VARCHAR(32) NOT NULL,
  price        INT         NOT NULL,
  restTickets  INT,
  flight_id    INT                  AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP
);
