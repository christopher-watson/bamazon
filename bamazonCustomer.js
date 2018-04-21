var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  console.log("\n-------------------");
  console.log("Welcome to Bamazon!");
  console.log("-------------------\n");
  itemList();
});

function itemList() {
  connection.query("SELECT * FROM products", function (err, res) {
    console.log("\nItems For Sale:");
    console.log("----------------\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + "\n -- $" + res[i].price + " | " + res[i].stock_quantity + "\n");
    }
    console.log("------------------------------------------------------\n");
  });
  buyProduct();
};

function newItem(){
  inquirer
  .prompt([
    {
      type: "confirm",
      message: "Would you like to purchase another product?",
      name: "confirm",
      default: true
    }
  ])
  .then(function(response) {
    if (response.confirm) {
      itemList();
    }
    else {
      console.log("\nThanks for shopping at bamazon!\n");
      console.log("Press ^C to Exit");
    }
  });
}

function buyProduct() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([{
          type: "input",
          message: "What item would you like to purchase?(Enter Product ID)",
          name: "chooseProduct",
          choices: function (value) {
            var num = parseInt(value);
            if (!isNaN(num) && num > 0 && num <= (res.length + 1)) {
              return true;
            } else {
              return ('Invalid Number');
            }
          },
        },
        {
          type: "input",
          message: "How many would you like to purchase?",
          name: "chooseAmt",
          default: 1,
          validate: function (value) {
            var num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              return true;
            } else {
              return ('Invalid Number');
            }
          }
        }
      ])
      .then(function (answer) {
        var itemPicked;
        console.log("\nYou've selected " + res[answer.chooseProduct-1].product_name + " (x" + answer.chooseAmt + ")");
        itemPicked = res[answer.chooseProduct-1];
        if (itemPicked.stock_quantity > parseInt(answer.chooseAmt)) {
          var newQuantity = itemPicked.stock_quantity - parseInt(answer.chooseAmt);
          connection.query(
            "UPDATE products SET ? WHERE ?", [
              {
                stock_quantity: newQuantity
              },
              {
                item_id: itemPicked.item_id
              }
            ],
            function (err) {
              if (err) throw err;

            }
          )
          var totalPrice = parseInt(answer.chooseAmt * itemPicked.price);
          console.log("\nYour Total Price: $" + totalPrice + "\n");
          newItem();
        }
        else{
          console.log("\nInsufficient Quantity!\n");
          newItem();
        }
      });
  });
}