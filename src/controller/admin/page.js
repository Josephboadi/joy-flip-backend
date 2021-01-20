const cloudinary = require("../../middleware/cloudinary");
const Page = require("../../models/page");

exports.createPage = async (req, res) => {
  const { banners, products } = req.files;

  // if(banners && banners.length > 0){

  if (banners && banners.length > 0) {
    let urls = [];
    try {
      //   const files = req.files;
      for (const banner of banners) {
        const { path } = banner;
        const newPath = await cloudinary.uploader.upload(path);
        urls.push(newPath);

        req.body.banners = urls.map((banner, index) => ({
          img: banner.secure_url,
          navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  // req.body.banners = banners.map((banner, index) => ({
  //     img: `${process.env.API}/public/${banner.filename}`,
  //     navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
  // }));
  // }
  if (products && products.length > 0) {
    let urls = [];
    try {
      //   const files = req.files;
      for (const product of products) {
        const { path } = product;
        const newPath = await cloudinary.uploader.upload(path);
        urls.push(newPath);

        req.body.products = urls.map((product, index) => ({
          img: product.secure_url,
          navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  req.body.createdBy = req.user._id;

  Page.findOne({ category: req.body.category }).exec((error, page) => {
    if (error) return res.status(400).json({ error });
    if (page) {
      Page.findOneAndUpdate({ category: req.body.category }, req.body).exec(
        (error, updatedPage) => {
          if (error) return res.status(400).json({ error });
          if (updatedPage) {
            return res.status(201).json({ page: updatedPage });
          }
        }
      );
    } else {
      const page = new Page(req.body);

      page.save((error, page) => {
        if (error) return res.status(400).json({ error });
        if (page) {
          return res.status(201).json({ page });
        }
      });
    }
  });
};

exports.getPage = (req, res) => {
  const { category, type } = req.params;
  if (type === "page") {
    Page.findOne({ category: category }).exec((error, page) => {
      if (error) return res.status(400).json({ error });
      if (page) return res.status(200).json({ page });
    });
  }
};
