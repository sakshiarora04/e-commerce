const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories including its associated Products
  try {
    const categoryData = await Category.findAll({
      // JOIN with products
      include: [
        {
          model: Product,
          //attributes: ["id", "productName", "price", "stock", "categoryId"],
        },
      ],
      attributes: {
        include: [
          [
            // plain SQL to get a count of all products
            sequelize.literal(
              `( 
                SELECT COUNT(*)
                FROM product AS pro
                WHERE
                pro.category_id = category.id
            )`
            ),
            'numberOfProducts',
          ],
        ],
      },
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value including its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      // JOIN with product
      include: [{ model: Product }],
    });
    // if no results found
    if (!categoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData[0]) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    // find category with all products in one category id
    await Product.destroy({ where: { categoryId: req.params.id } });
    //const cat = await Category.findByPk(req.params.id, { include: Product });
    // delete category
    const categoryData = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
