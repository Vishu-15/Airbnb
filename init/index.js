const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

const dbUrl = process.env.ATLAS_DB_URL;

main()
    .then(()=>{
        console.log('connection succesful');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

const initDB=async()=>{
  await Listing.insertMany(initData.data);
  console.log('data was initialized');
};

initDB();
