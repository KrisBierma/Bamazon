//var to draw from npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");

//connection info to mysql db
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Root",
    database:"bamazonDB"
});

//connect to the particular db
connection.connect(function(err){
    if(err) throw err;
    // console.log("Connected as id "+connection.thread+"\n");
    readProducts();
});

var itemsList=[]; //array to hold objects of items for sale
//display all items for sale, including ids, names, and prices
function readProducts(){

    //query mysql to see all info in table
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
            var item={}; //obj of each item for sale, holds...
            item.id=res[i].item_id; //item id from results
            item.name=res[i].product_name; //name
            item.price=res[i].price; //price
            item.quantity=res[i].stock_quantity; //quantity
            // console.log(item.quantity); //working
            item={id:item.id, name:item.name, price:item.price, quantity:item.quantity};//put info into object
            itemsList.push({item:item}); //push object into array holding all items
            // console.log(itemsList); //delete
            console.log(item.id+" "+item.name+" $"+item.price);
            // console.log(item); //delete
        }
        // console.log("here"+itemsList);  //delete

        //call function to get user input
        askUser();
    }
    );
    // console.log(query); //delete
};

//function to ask user what item and how many to buy
function askUser(){
    inquirer.prompt([
        {
         name:"idToBuy",
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

        //get info from itemsList created above
        var convertArrayPlace = parseInt(answer.idToBuy)-1;
        var itemInfo=(itemsList[convertArrayPlace].item);

        //check if there are enough units of the item using its id
        if (answer.units<=itemInfo.quantity){

            //if there are engough, figure new quantity
            var newQuantity = itemInfo.quantity - answer.units;
            // console.log("newQuan: "+newQuantity); //delete

            //update db, set quantity where id is
            connection.query(
                "Update products Set ? Where ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: answer.idToBuy
                    }
                ],function(err){
                    if (err) throw err;

                    //show total of purchase
                    console.log("You bought "+answer.units+" units of "+itemInfo.name);
                    console.log("Your total is: $"+answer.units * itemInfo.price+"\n");
                }
            )

            //start over  
            readProducts();
            // connection.end();
        }
        
        //else show error message and start over
        else{
            console.log("Insufficient quantity!\n");
            readProducts();
        }
    })
};

