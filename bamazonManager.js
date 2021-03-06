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
  menu();
});

function menu() {
  inquirer
    .prompt([{
      type: "list",
      message: "Manager Options",
      choices: ["View Products on Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
      name: "menuOptions",
      default: 0
    }])
    .then(function (response) {
      switch (response.menuOptions) {
        case "View Products on Sale":
          itemList();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;

        case "Exit":
          exit();
          break;

        default:
          console.log("Please choose one of the menu items");
          menu();
      }
    });
}

function itemList() {
  connection.query("SELECT * FROM products", function (err, res) {
    console.log("\nItems For Sale:");
    console.log("----------------\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " -- $" + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("------------------------------------------------------\n");
    menu();
  });
};

function lowInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    console.log("\nLow Inventory Items:");
    console.log("--------------------");
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " -- $" + res[i].price + " | " + res[i].stock_quantity);
      }
    }
    console.log("------------------------------------------------------\n");
    menu();
  });
  // console.log("lowInventory");
}

function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([{
          type: "list",
          message: "For which product would you like to Add Inventory?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          },
          name: "choice",
        },
        {
          type: "input",
          message: "How much inventory would you like to add?",
          name: "inventoryAdded",
          default: 100,
          validate: function (value) {
            var num = parseInt(value);
            if (!isNaN(num) && num >= 0) {
              return true;
            } else {
              return ('Invalid Number');
            }
          }
        }
      ])
      .then(function (answer) {
        var itemPicked;
        var flagged = false;
        var newStock;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.choice) {
            itemPicked = res[i];
            flagged = true;
            newStock = parseInt(answer.inventoryAdded) + parseInt(itemPicked.stock_quantity);
          }
        }
        if (flagged) {
          connection.query(
            "UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
              },
              {
                item_id: itemPicked.item_id
              }
            ],
            function (err) {
              if (err) throw err;
            }
          )
          console.log("\nUpdated " + itemPicked.product_name + " quantity to " + newStock + "\n");
          menu();
        }
      });
  });
}

function addProduct() {
  inquirer
    .prompt([{
        type: "input",
        message: "Enter the NAME of the product",
        name: "productName"
      },
      {
        type: "input",
        message: "Enter the DEPARTMENT for the product",
        name: "productDept"
      },
      {
        type: "input",
        message: "Enter a PRICE for the product",
        name: "productPrice",
        default: 0,
        validate: function (value) {
          var num = parseInt(value);
          if (!isNaN(num) && num >= 0) {
            return true;
          } else {
            return ('Invalid Number');
          }
        }
      },
      {
        type: "input",
        message: "Enter a QUANTITY for the product",
        name: "productQuant",
        default: 100,
        validate: function (value) {
          var num = parseInt(value);
          if (!isNaN(num) && num >= 0) {
            return true;
          } else {
            return ('Invalid Number');
          }
        }
      }
    ])
    .then(function (response) {
      connection.query(
        "INSERT INTO products SET ?", {
          product_name: response.productName,
          department_name: response.productDept,
          price: response.productPrice,
          stock_quantity: response.productQuant
        },
        function (err, res) {
          if (err) throw err;
          console.log("\n" + response.productName + " has been added!\n")
          menu();
        }
      )
    });
}

function exit(){
  console.log("Bye! (Press ^C to Exit)")
}