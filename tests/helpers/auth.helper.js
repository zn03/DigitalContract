const { Account } = require('../../models');
require('dotenv').config();

module.exports.dummyData = {
  username: 'test username',
  name: 'test name',
  email: 'test@email.com',
  password: 'Password1!',
  phone: '0987654321',
  address: 'home'
};

module.exports.createDummyAccount = async (data) => {
  if (!data) data = this.dummyData;
  
  try {
    const account = await Account.create(data);
    
    return account;
  } catch (err) {
    console.error(err);
  }
};
