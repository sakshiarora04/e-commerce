const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags including its associated Product data
  try {
    const tagData = await Tag.findAll({
      // JOIN with product through junction table product_tag
      include: [{ model: Product, through: ProductTag, as: "products" }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id` including its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      // JOIN with product through junction table product_tag
      include: [{ model: Product, through: ProductTag, as: "products" }],
    });

    if (!tagData) {
      res.status(404).json({ message: "No product found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  //create a new category
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});
//to create tag with products array
// router.post("/", async (req, res) => {
//   // create a new tag
//   let product;
//   try {
//     const newTag = await Tag.create(req.body);
//     // if there's productIds, we need to create pairings to bulk create in the ProductTag model
//     if (req.body.productIds.length) {
//       const tagProductArr = req.body.productIds.map((product_id) => {
//         return {
//           productId: product_id,
//           tagId: newTag.id,
//         };
//       });
//       product = await ProductTag.bulkCreate(tagProductArr);
//       newTag.products=product;
//     }
//     res.status(200).json(newTag);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
//update tag including products
// router.put("/:id", async (req, res) => {
//   let tag;
//   try {
//     const status = await Tag.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (req.body.productIds && req.body.productIds.length) {
//       const productTags = await ProductTag.findAll({
//         where: { tag_id: req.params.id },
//       });
//       const tagProductIds = productTags.map(({ productId }) => productId);
//       const newTagsProduct = req.body.productIds
//         .filter((product_id) => !tagProductIds.includes(product_id))
//         .map((product_id) => {
//           return {
//             productId: product_id,
//             tagId: req.params.id,
//           };
//         });
//       const productTagsToRemove = productTags
//         .filter(({ productId }) => !req.body.productIds.includes(productId))
//         .map(({ id }) => id);
//       await ProductTag.destroy({ where: { id: productTagsToRemove } });
//       tag = await ProductTag.bulkCreate(newTagsProduct);
//     }
//     res.status(200).json({ message: status, tag });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagData[0]) {
      console.log({ message: "No user with this id!" });
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: "No location found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
