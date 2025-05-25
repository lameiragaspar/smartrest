
-- Banco de dados completo com todas as tabelas, já migradas e consistentes
DROP DATABASE IF EXISTS restaurante;
CREATE DATABASE restaurante;
USE restaurante;

-- Tabela users (com role já incluída)
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Tabela tables
CREATE TABLE tables (
  id INT(11) NOT NULL AUTO_INCREMENT,
  table_number INT(11) NOT NULL UNIQUE,
  people_count INT(11) NOT NULL,
  status ENUM('available','occupied','reserved') DEFAULT 'available',
  PRIMARY KEY (id)
);

-- Tabela clients
CREATE TABLE clients (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  table_number INT(11),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Tabela orders (com request_status incorporado)
CREATE TABLE orders (
  id INT(11) NOT NULL AUTO_INCREMENT,
  table_id INT(11),
  client_id INT(11),
  total DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('pending','in_preparation','delivered','cancelled') DEFAULT 'pending',
  request_status ENUM('pendente','em preparo','pronto','entregue') DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabela order_items (cliente_id incorporado)
CREATE TABLE order_items (
  id INT(11) NOT NULL AUTO_INCREMENT,
  order_id INT(11),
  product_id INT(11),
  cliente_id INT(11),
  quantity INT(11) DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabela products
CREATE TABLE products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT(11),
  image_url VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela categories
CREATE TABLE categories (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- Tabela assessment
CREATE TABLE assessment (
  id INT(11) NOT NULL AUTO_INCREMENT,
  table_id INT(11),
  stars INT(11),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (table_id) REFERENCES clients(id)
);

-- Tabela calls
CREATE TABLE calls (
  id INT(11) NOT NULL AUTO_INCREMENT,
  table_id INT(11),
  reason TEXT,
  status ENUM('waiting','attended') DEFAULT 'waiting',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Tabela notifications
CREATE TABLE notifications (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11),
  message TEXT,
  read_status TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela payments
CREATE TABLE payments (
  id INT(11) NOT NULL AUTO_INCREMENT,
  order_id INT(11),
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('cash','credit','debit','pix') DEFAULT 'cash',
  paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  comprovativo_arquivo VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Tabela status_log
CREATE TABLE status_log (
  id INT(11) NOT NULL AUTO_INCREMENT,
  table_id INT(11),
  order_id INT(11),
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Procedimento ConfirmarPagamentoEEncerrarMesa
DELIMITER $$
CREATE PROCEDURE ConfirmarPagamentoEEncerrarMesa(IN p_table_number INT)
BEGIN
  DECLARE v_table_id INT;
  SELECT id INTO v_table_id FROM tables WHERE table_number = p_table_number;

  DELETE oi FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE o.table_id = v_table_id;

  DELETE FROM orders WHERE table_id = v_table_id;
  DELETE FROM clients WHERE table_number = p_table_number;
  UPDATE tables SET status = 'available', people_count = 0 WHERE table_number = p_table_number;
END$$
DELIMITER ;
