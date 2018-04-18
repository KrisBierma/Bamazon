var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("easy-table");

//connection info to mysql db
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Root",
    database:"bamazonDB"
});

menu();

function menu(){
    inquirer.prompt([
        {
            name:"supervisorMenu",
            type:"rawlist",
            choices:["View product sales by department", "Create new department"],
            message:"\nHi! What would you like to do today?"
        }
    ])
    .then(function(answer){
        if (answer.supervisorMenu==="View product sales by department"){
            viewSales();
        }
        else{createDept();}
    })
};

//shows sales info 
function viewSales(){
    //call the db
    connection.query(
        "Select departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, (product_sales - over_head_costs) As total_profit From departments Left Join products On departments.department_name = products.department_name Group By department_name",
    function(err, res){
        if(err) throw err;

        //convert results to objects; push to array
        var data=[];
        for (var i=0; i<res.length; i++){
            var convert = JSON.stringify(res[i]);
            var convert2 = JSON.parse(convert);
            data.push(convert2);
        };

        var t = new Table;

        //create table with results
        data.forEach(function(product){
            t.cell("Department ID", product.department_id);
            t.cell("Department Name",product.department_name);
            t.cell("Overhead Costs", product.over_head_costs);
            t.cell("Product Sales", product.product_sales);
            t.cell("Total Profit",product.total_profit);
            t.newRow();
        });
        console.log("\n"+t.toString()+"\n");
        menu();
    })
};

//to create a new department and push to db
function createDept(){
    inquirer.prompt([
        {
            name:"newDept",
            type:"input",
            message:"What is the name of the new department?"
        },
        {
            name:"overhead",
            type:"input",
            message:"What is the overhead cost for this department?",
            validate: function(value){
                if(isNaN(value)===false)
                {return true;}
                return false;
            }
        }
    ])
    .then(function(answer){
        connection.query(
            "Insert Into departments Set ?",
            {
                department_name:answer.newDept,
                over_head_costs:answer.overhead
            }
        )
        console.log("\nDepartment created!");
        menu();
    })
};