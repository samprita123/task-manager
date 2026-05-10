const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const check = async () => {
    try {
        // Try current URI
        await mongoose.connect(process.env.MONGODB_URI);
        const dbName = mongoose.connection.db.databaseName;
        const count = await mongoose.connection.db.collection('projects').countDocuments();
        console.log(`DB: ${dbName}, Projects: ${count}`);
        await mongoose.disconnect();

        // Try default 'test'
        const testUri = process.env.MONGODB_URI.replace('/task-manager', '/test');
        await mongoose.connect(testUri);
        const testCount = await mongoose.connection.db.collection('projects').countDocuments();
        console.log(`DB: test, Projects: ${testCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
