const mongoose=require("mongoose");
const initdata=require("./data.js")//requiring data which is stored in data.js
const Listing=require("../models/listing.js")
const mongourl="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connection to db")
}).catch((err)=>{
    console.log(err)
})

async function main() {
   await mongoose.connect(mongourl);    
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
  ...obj,
  owner: '6956a6033d9db27da29e1a34'
}));

     await Listing.insertMany(initdata.data);
     console.log("data init")
}

initDB();

// 🧠 What this line means (in simple English)
// Step-by-step:

// initdata.data → array of objects

// .map() → creates a new array

// obj → each object in the array

// ...obj → copy all existing properties

// owner: '...' → add / overwrite the owner field

// Final meaning:

// “Take every object in initdata.data, keep all its fields, and add an owner field with this user ID.”


