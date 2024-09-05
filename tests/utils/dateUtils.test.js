const tk = require('timekeeper');
const { getDateTomorrow } = require('../../utils/dateUtils');
require('dotenv').config();

describe('date utils test suite', () => {
  it('should return tomorrow date', async () => {
    tk.freeze(); // Freeze time
    const date = new Date();
    date.setHours(date.getHours() + parseInt(process.env.GMT))
    date.setDate(date.getDate() + 1);
    const tomorrow = getDateTomorrow();
    expect(date).toEqual(tomorrow);
  });
});