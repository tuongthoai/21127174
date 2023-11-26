const models = require("../models");
const sequelize = require("sequelize");
const op = sequelize.Op;
const controller = {};

controller.showList = async (req, res) => {
  let page = isNaN(req.query.page) ? 1 : Math.max(parseInt(req.query.page), 1);

  let category = isNaN(req.query.category)
    ? 0
    : parseInt(req.query.category, 10);
  let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag, 10);

  let categories = await models.Category.findAll({
    include: [{ model: models.Blog }],
  });
  res.locals.categories = categories;

  let tags = await models.Tag.findAll();
  res.locals.tags = tags;

  let keywords = req.query.key || "";

  let options = {
    attribute: [
      "id",
      "title",
      "imagePath",
      "summary",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: models.Comment,
      },
    ],
    where: {},
  };

  if (category > 0) {
    options.where.categoryId = category;
  }

  if (tag > 0) {
    options.include.push({ model: models.Tag, where: { id: tag } });
  }

  if (keywords != "" && keywords != undefined) {
    options.where.title = {
      [op.like]: `%${keywords}%`,
    };
  }

  // biến paging
  const limit = 4;
  options.limit = limit;
  options.offset = limit * (page - 1);

  // cnt 
  let {rows, count} = await models.Blog.findAndCountAll(options);

  res.locals.pagination = {
    page: page,
    limit: limit,
    totalRows: count,
    queryParams: req.query, 
  }

  res.locals.blogs = rows;
  // res.locals.blogs = await models.Blog.findAll(options);
  res.render("index");
};

controller.showDetails = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : req.params.id;
  res.locals.blog = await models.Blog.findOne({
    attribute: [
      "id",
      "title",
      "imagePath",
      "summary",
      "createdAt",
      "updatedAt",
    ],
    where: {
      id: id,
    },
    include: [
      { model: models.Category },
      { model: models.User },
      { model: models.Tag },
    ],
  });
  res.render("details");
};

module.exports = controller;
