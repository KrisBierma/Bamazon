var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Root",
    database:"bamazonDB"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected as id "+connection.thread+"\n");
    readProducts();
});

//display all items for sale, including ids, names, and prices
var itemsList=[];
function readProducts(){
    console.log("Reading products\n");
    var query = connection.query(
        "Select * From products",
        // {
        //     item_id, product_name, price
        // },
    function(err, res){
        if (err) throw err;
        // console.log(res.length);
        // connection.end();
        itemsList=[];
        console.log("Items for sale:\n");
        for (var i=0; i<res.length;i++){
            var item={};
            item.id=res[i].item_id;
            item.name=res[i].product_name;
            item.price=res[i].price;
            item={id:item.id, name:item.name, price:item.price};
            itemsList.push({item:item});
            // console.log(itemsList);
            console.log(item.id+" "+item.name+" $"+item.price);
            // console.log(item);
        }
        // console.log(itemsList);
        askUser();
    }
    );
    // console.log(query);
};

function askUser(){
    inquirer.prompt([
        {
         name:"itemToBuy",
         type:"rawlist",
         choices:function(){
             var idsArray=[];
             for (var i=0; i<itemsList.length; i++){

                 //change integer to string or get errors
                 var idToString=String(itemsList[i].item.id);
                 idsArray.push(idToString);
             }
             return idsArray;
         },   
         message:"What item would you like to buy?"
        },
        {
            name:"units",
            type:"input",
            message:"How many units would you like to buy?",
            validate: function(value){
                if (isNaN(value)===false){
                    return true;
                }
                return false;
            }
        }
    ]).
    then(function(answer){
        console.log(answer);
    })
};