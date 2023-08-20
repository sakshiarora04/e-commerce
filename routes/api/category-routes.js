const router = require("express").Router();
const { Category, Product } = require("../../models");
// const { Category, Product, ProductTag } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
      attributes: {
        include: [
          [
            sequelize.literal(`  (
              SELECT COUNT(*)
              FROM product AS pro
              WHERE
                  pro.category_id = 1
          )`),
            "Count",
          ],
        ],
      },
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      // JOIN with travellers, using the Trip through table
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No Category found with this id!" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData[0]) {
      res.status(404).json({ message: "No user with this id!" });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    // const categoryData = await Category.findByPk(req.params.id, {
    //   // JOIN with Category, using the Tag through table
    //   include: [{ model: Product}],
    // });
    // const categoryData = await Product.findAll({
    //   where: {
    //     category_id: req.params.id
    //   }
    // });
    const cat = await Category.findByPk(req.params.id, { include: Product });
    await cat.removeProducts(cat.products);
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    console.log(categoryData);
    // const categoryData = await Category.destroy({
    //   where: {
    //     id: req.params.id,
    //   }
    // });
    console.log(categoryData);
    if (!categoryData) {
      res.status(404).json({ message: "No location found with this id!" });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
