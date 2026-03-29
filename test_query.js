const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sale = require('./models/Sale');

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Check all completed sales matching our criteria
    const houseNo = '9';
    const flockNo = '2322';
    
    console.log(`Checking for houseNo=${houseNo}, flockNo=${flockNo}`);
    
    const sales = await Sale.find({ 
      houseNo: houseNo, 
      flockNo: flockNo,
      status: 'completed'
    }).select('houseNo flockNo rate status').sort({ date: -1 }).limit(5);
    
    console.log('Results (exact match):', sales);
    
    // Check all completed sales
    const allCompleted = await Sale.find({ status: 'completed' }).select('houseNo flockNo rate').limit(5);
    console.log('Some completed sales:', allCompleted);

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

test();
