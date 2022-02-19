const express =require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride =require('method-override');
const bodyParser = require("body-parser");
const dummyData = require('./data.js').dummyData;

const customer= require('./models/customer');
const Transaction= require('./models/transaction');

mongoose.connect('mongodb+srv://admin-Shayantan:Test123@cluster0.1kb6c.mongodb.net/bank',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

customer.insertMany(dummyData)
.then(res => console.log(res))
.catch(err => console.log(err));

app.get("/",function(req,res){
res.render("home");
});


app.get("/view",function(req,res){
  customer.find(function(err,persons){
    if(err){
      console.log(err);
    }
    else{
    //  console.log(persons);
      res.render('customerList',{persons});
    }
  });
});

app.get('/view/:id', function(req,res){
customer.findOne({_id: req.params.id}, function(err, person){
    if (person) {
      customer.find(function(err,persons){
       if(err){
         console.log(err);
       }
       else{
      res.render('transfer', {person:person,persons:persons});
       }
     });
    }
     else {
    console.log("error");
    }
 });
});

app.get("/view/:id1/:id2", function(req, res){
    const {id1, id2} = req.params;
    customer.findById(id1,function(err,fromUser){
      if(err){
        console.log(err);
      }
      else{
        customer.findById(id2,function(error,toUser){
          if(error){
            console.log(error);
          }
          else{
            res.render("deposit", {fromUser, toUser});
          }
        });
      }
    });
});

app.put("/view/:id1/:id2", function(req, res){
    const {id1, id2} = req.params;
    const credit = req.body.credit;
    customer.findById(id1,function(err,fromUser){
      if(err){
        console.log(err);
      }
      else{
        customer.findById(id2,function(error,toUser){
          if(error){
            console.log(error);
          }
          else{
            if(credit <= fromUser.balance && credit > 0){

            let fromCreditsNew = fromUser.balance - credit;
            let toCreditsNew = toUser.balance + Number(credit);
             customer.findByIdAndUpdate(id1, {balance : fromCreditsNew},{ runValidators: true, new: true },function(e,demo){
               if(e){
                 console.log(e);
               }
               else{
                 console.log("Updated balance ",demo);
               }
             });
             customer.findByIdAndUpdate(id2, {balance : toCreditsNew},{ runValidators: true, new: true },function(er,demoo){
               if(er){
                 console.log(er);
               }
               else{
                 console.log("Updated balance ",demoo);
               }
             });

                let newTransaction = new Transaction();
                newTransaction.depositName = fromUser.name;
                newTransaction.withdrawName = toUser.name;
                newTransaction.transferAmount = credit;
                newTransaction.save();

                res.redirect("/view");
            }
            else{
                res.render('error');
            }
          }
        });
      }
    });
  });

app.get("/history",function(req,res){
  Transaction.find({},function(err,transactions){
    res.render("transactionHistory", {transactions});
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
