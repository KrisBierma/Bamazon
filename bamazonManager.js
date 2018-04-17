// var fs=require("fs");
// var Customer = require("./bamazonCustomer");
var inquirer = require("inquirer");
var mysql = require("mysql");
// var connection = require("./bamazonCustomer");

//connection info to mysql db
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Root",
    database:"bamazonDB"
});

menu();

var addingInventory=false;
//give menu options via inquirer prompt
function menu(){
    inquirer.prompt([
        {
            name:"menuOption",
            type:"rawlist",
            choices:["View inventory", "View low inventory", "Add to inventory", "Add new product"],
            message:"Hi! What would you like to do today?"
        }
    ])
    .then(function(answer){
        //switch case for answer.option
        switch (answer.menuOption){
            case "View inventory":
                var query="Select item_id, product_name, price, stock_quantity From products"; 
                console.log("\nInventory:");
                viewProducts(query);
                break;
            case "View low inventory":
                var query="Select item_id, product_name, stock_quantity From products Where stock_quantity<5";
                console.log("\nLow Inventory:");
                viewProducts(query);
                break;
            case "Add to inventory":
                var query = "Select * From products";
                addingInventory=true;
                viewProducts(query);
                break;
            default:
                // newProduct();
        };
    });
};

//view products for sale, inc ids, names, prices, quantities 
//takes in query from menu choices: view all products or those with quantity < 5
var itemsList=[]; //array to hold objects of items for sale
function viewProducts(query){
    // var itemsList=[]; //array to hold objects of items for sale
    
    //query mysql to see all info in table
    connection.query(query,
    function(err, res){
        if (err) throw err;
        // connection.end();
        itemsList=[];
        for (var i=0; i<res.length;i++){
            var item={}; //obj of each item for sale, holds...
            item.id=res[i].item_id; //item id from results
            item.name=res[i].product_name; //name
            item.price=res[i].price; //price
            item.quantity=res[i].stock_quantity; //quantity
            item={id:item.id, name:item.name, price:item.price, quantity:item.quantity};//put info into object
            itemsList.push({item:item}); //push object into array holding all items
            if (!addingInventory){
                console.log(item.id+" "+item.name+" $"+item.price+" "+item.quantity);
            };
        }
        console.log("\n");    
        if (!addingInventory){menu();}
        else {addInventory()};
        }
    );
};

//add to inventory
function addInventory(){
    inquirer.prompt([
        {
        name:"itemToAdd",
        type:"rawlist",
        choices:function(){
            //holds ids for user choices in terminal
            var idsArray=[];
            for (var i=0; i<itemsList.length; i++){

                //change integer to string or get errors!
                var idToString=String(itemsList[i].item.id);
                idsArray.push(idToString);
            }
            return idsArray;
        },   
        message:"Which item are you adding more of?"
       },
       {
           name:"units",
           type:"input",
           message:"How many units would you like to add?",
           validate: function(value){
               if (isNaN(value)===false){
                   return true;
               }
               return false;
           }
       }
    ])
   .then(function(answer){
        //figure new quantity
        var newQuantity=parseInt(answer.units) + parseInt(
        itemsList[answer.itemToAdd].item.quantity);

        connection.query(
            "Update products Set ? Where ?",
            [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: answer.itemToAdd 
                }
            ],
        );
        addingInventory=false;
        console.log("Item updated!\n");
        menu();
    })
};

//add new product