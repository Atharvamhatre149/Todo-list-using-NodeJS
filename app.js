//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Atharva1492:Lata1492@cluster0.83bzhx7.mongodb.net/todolistDB",function (err,db) {
  if(err){
    console.log(err);
  }
  
});

const itemSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemSchema); 

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// module.exports = mongoose.model("items",Item);

const item1=new Item({
  name:"Welcome to your Todolist"
})

const item2=new Item({
  name:"Hit + button to add a new item"
})

const item3=new Item({
  name:"<-- hit this to delete item"
})

const defaultItems=[item1,item2,item3];

const listSchema={
  name: String,
  items:[itemSchema]
}

const  List=mongoose.model("List",listSchema);



app.get("/",function (req,res) {

  Item.find({},function(err,foundItems) {

    if(foundItems.length === 0)
    {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Succesfully added");
        }
      }); 
      res.redirect("/");
    }
    else{
      res.render("list",{listTitle:"Today",newListItems:foundItems});
    }
    

  });
 
});
   
app.get("/:customList",function(req,res){
      const customList=_.capitalize(req.params.customList);

      List.findOne({name:customList},function(err,foundList) {
        if(!err){
            if(!foundList){
              const list=new List({
                name:customList,
                items:defaultItems
              });
              list.save();  
              res.redirect("/"+customList) 
            }
            else{
              res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
            }
        }
      });

      
     
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item=new Item({
    name:itemName
  })

  if(listName==="Today")
  {
    if(item.name.length>0)
    {
      item.save();
    }
   
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundlist){
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/"+listName)
    })
  }
  

  
});

app.post("/delete",function (req,res) {
  const checkItemId= (req.body.checkbox);
  const listName= req.body.listname;

  if(listName==="Today")
  {
    Item.findByIdAndRemove(checkItemId,function (err) {
      if(err)
      {
        console.log(err);
      }
      res.redirect("/");

    });
  }
  else{
     List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemId}}},function(err,foundlist) {
      if(!err)
      {
        res.redirect("/"+listName);
      } 
     });
  }
    
    
   });
 
  

 

app.listen(3000 || process.env.PORT, function() {
  console.log("Server started on port sucessfully ");
});














// const workItems = [];

// app.get("/", function(req, res) {

// const day = date.getDate();

//   res.render("list", {listTitle: day, newListItems: items});

// });



// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });


