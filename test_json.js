const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sale = require('./models/Sale');

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const sales = await Sale.find({ 
      houseNo: '9', 
      flockNo: '2322',
      status: 'completed'
    }).select('houseNo flockNo rate status').sort({ date: -1 }).limit(5);
    
    const allCompleted = await Sale.find({ status: 'completed' }).select('houseNo flockNo rate').limit(5);

    fs.writeFileSync('test_out.json', JSON.stringify({
      specificMatch: sales,
      generalMatches: allCompleted
    }, null, 2), 'utf-8');

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

test();
