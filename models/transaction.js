const mongoose=require('mongoose');

const transactionSchema= new mongoose.Schema({
  depositName:{
    type:String,
    required:true
  },
  withdrawName:{
    type:String,
    required:true
  },
  transferAmount:{
    type:Number,
    required:true
  }
});

const Transaction=  mongoose.model('Transaction',transactionSchema);

module.exports=Transaction;
