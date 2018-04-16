Drop database if exists bamazonDB;

Create database bamazonDB;

Use bamazonDB;

Create table if not exists products(
	item_id integer(10) auto_increment,
    product_name varchar(30),
    department_name varchar(30),
    price integer(10),
    stock_quantity integer(10),
    primary key(item_id)
);

Select * from products;

Insert into products
(product_name, department_name, price, stock_quantity)
values
("The Forgetting", "Books", 5, 50),
("The Knowing", "Books", 5, 25),
("5 Love Languages", "Books", 12, 50),
("Blue stripe socks", "Clothing", 8, 30),
("Purple paisley socks", "Clothing", 8, 45),
("Blue hoodie", "Clothing", 25, 55),
("Hex keys", "Tools", 15, 20),
("Miter saw", "Tools", 200, 5),
("Router", "Tools", 95, 10), 
("Laser level", "Tools", 25, 22);
