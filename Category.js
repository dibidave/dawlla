var Database_Object = require("dijible-lib/Database_Object");
var database = require("dijible-lib/connectors/database");

const collection_name = "Categories";

const Category = {

};

exports.create_category = function(name) {

  var category = Database_Object.create_database_object(collection_name);
  Object.assign(category, Category);

  category.name = name;

  return category;
};

exports.get_categories = function() {

  var promise = database.get_objects(collection_name)
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