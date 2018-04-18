DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price INT default 0,
  stock_quantity INT default 0,
 
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Camo Backpack", "Luggage & Travel", 30, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JBL Clip", "Electronics", 40, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("20000Mah Power Bank", "Cell Phones & Accessories", 70, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Digital Food Scale", "Home & Kitchen", 12.50, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yamaha HS7 Studio Monitor", "Musical Instrument", 300, 50);
-- finish books
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JBL Clip", "Electronics", 40, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("20000Mah Power Bank", "Cell Phones & Accessories", 70, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Digital Food Scale", "Home & Kitchen", 12.50, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("20000Mah Power Bank", "Cell Phones & Accessories", 70, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Digital Food Scale", "Home & Kitchen", 12.50, 100);