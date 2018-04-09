var express = require("express");
var router = express.Router();
var database = require("dijible-lib/connectors/database");
var dateformat = require('dateformat');
var logger = require("dijible-lib/util/logger").get_logger("routes");
var path = require("path");
var Account = require("./Account");
var Category = require("./Category");
var Legal_Entity = require("./Legal_Entity");
var Transaction = require("./Transaction");

var get_home_page = function(request, response, next) {
  response.render("index", { title: "Express" });
};

var post_account = function(request, response) {

  var account_name = request.body.name;

  var account = Account.create_account(account_name);

  account.save()
  .then(function() {

    return response.json({
      account: account.to_JSON()
    });
  });
  
};

var get_accounts = function(request, response) {

  Account.get_accounts()
  .then(function(accounts) {
    var JSON_objects = [];

    for(var account_index = 0; account_index < accounts.length;
      account_index++) {
      var account = accounts[account_index].to_JSON();
      JSON_objects.push(account);
    }

    return response.json({
      accounts: JSON_objects
    });
  });
};

var post_category = function(request, response) {

  var category_name = request.body.name;

  var category = Category.create_category(category_name);

  category.save()
  .then(function() {

    return response.json({
      category: category.to_JSON()
    });
  });
  
};

var get_categories = function(request, response) {

  Category.get_categories()
  .then(function(categories) {
    var JSON_objects = [];

    for(var category_index = 0; category_index < categories.length;
      category_index++) {
      var category = categories[category_index].to_JSON();
      JSON_objects.push(category);
    }

    return response.json({
      categories: JSON_objects
    });
  });
};

var post_legal_entity = function(request, response) {

  var legal_entity_name = request.body.name;

  var legal_entity = Legal_Entity.create_legal_entity(legal_entity_name);

  legal_entity.save()
  .then(function() {

    return response.json({
      legal_entity: legal_entity.to_JSON()
    });
  });
  
};

var get_legal_entities = function(request, response) {

  Legal_Entity.get_legal_entities()
  .then(function(legal_entities) {

    var JSON_objects = [];

    for(var legal_entity_index = 0; legal_entity_index < legal_entities.length;
      legal_entity_index++) {
      var legal_entity = legal_entities[legal_entity_index].to_JSON();
      JSON_objects.push(legal_entity);
    }

    return response.json({
      legal_entities: JSON_objects
    });
  });
};

var get_transactions = function(request, response) {

  Transaction.get_transactions()
  .then(function(transactions) {

    var JSON_objects = [];

    for(var transaction_index = 0; transaction_index < transactions.length;
      transaction_index++) {
      var transaction = transactions[transaction_index].to_JSON();
      JSON_objects.push(transaction);
    }

    return response.json({
      transactions: JSON_objects
    });

  });
};

var post_transaction = function(request, response) {

  var transaction = Transaction.create_transaction(request.body);
  transaction.save()
  .then(function(transaction) {
    return response.json({transaction: transaction});
  });
};

var get_session = function(request, response) {

  return response.json({
    session: request.session
  });
};

router.get("/", get_home_page);
router.post("/accounts", post_account);
router.get("/accounts", get_accounts);
router.post("/categories", post_category);
router.get("/categories", get_categories);
router.post("/legal_entities", post_legal_entity);
router.get("/legal_entities", get_legal_entities);
router.post("/transactions", post_transaction);
router.get("/transactions", get_transactions);
router.get("/session", get_session);
module.exports = router;