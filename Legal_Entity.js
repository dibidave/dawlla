var Database_Object = require("dijible-lib/Database_Object");
var database = require("dijible-lib/connectors/database");

const collection_name = "Legal_Entities";

const Legal_Entity = {

};

exports.create_legal_entity = function(name) {

  var legal_entity = Database_Object.create_database_object(collection_name);
  Object.assign(legal_entity, Legal_Entity);

  legal_entity.name = name;

  return legal_entity;
};

exports.get_legal_entities = function() {

  var promise = database.get_objects(collection_name)
  .then(function(legal_entities_JSON) {

    var legal_entities = [];

    for(var legal_entity_index = 0;
      legal_entity_index < legal_entities_JSON.length;
      legal_entity_index++) {

      var legal_entity = exports.create_legal_entity();
      legal_entity.from_JSON(legal_entities_JSON[legal_entity_index]);

      legal_entities.push(legal_entity);
    }

    return legal_entities;
  });

  return promise;
}