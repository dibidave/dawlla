var Database_Object = require("dijible-lib/Database_Object");
var database = require("dijible-lib/connectors/database");

const collection_name = "Categories";

const Category = {

};

exports.create_category = function(user_id, name) {

  var category = Database_Object.create_database_object(user_id,
    collection_name);
  Object.assign(category, Category);

  category.name = name;

  return category;
};

exports.get_categories = function(user_id) {

  var promise = database.get_objects(user_id, collection_name)
  .then(function(cagegories_JSON) {

    var categories = [];

    for(var category_index = 0; category_index < cagegories_JSON.length;
      category_index++) {

      var category = exports.create_category();
      category.from_JSON(cagegories_JSON[category_index]);

      categories.push(category);
    }

    return categories;
  });

  return promise;
}