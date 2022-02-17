const mongoose=require('mongoose');

const customerSchema= new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  balance:{
    type:Number,
    min:0,
    required:true
  }
});

const customer= mongoose.model('Customer',customerSchema);

module.exports=customer;
