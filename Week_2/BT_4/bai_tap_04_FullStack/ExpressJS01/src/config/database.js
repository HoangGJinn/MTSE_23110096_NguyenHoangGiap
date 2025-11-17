require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [{
    value: 0,
    label: "Disconnected"
},
{
    value: 1,
    label: "Connected"
},
{    value: 2,
    label: "Connecting"
},
{    value: 3,
    label: "Disconnecting"
}];

const connection = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    const state = Number(mongoose.connection.readyState);
    // console.log(`Database connection state: ${dbState[state].label}`);
    console.log(dbState.find(item => item.value === state).label);
}

module.exports = connection;