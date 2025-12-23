const Category = require('../models/Category');

const seedCategories = async () => {
  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Books' },
    { name: 'Home & Garden' },
    { name: 'Sports' },
  ];
  await Category.insertMany(categories, { ordered: false }).catch(() => {});
};

module.exports = seedCategories;