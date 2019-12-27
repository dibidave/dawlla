var Database_Object = require("dijible-lib/Database_Object");
var database = require("dijible-lib/connectors/database");

const collection_name = "Accounts";

const Account = {

};

exports.create_account = function(user_id, account_JSON) {

  var account = Database_Object.create_database_object(
    user_id, collection_name);
  Object.assign(account, Account);

  account.from_JSON(account_JSON);

  if(account.balance === undefined) {
    account.balance = 0;
  }

  if(account.available_balance === undefined) {
    account.available_balance = 0;
  }

  return account;
};

exports.get_accounts = function(user_id) {

  var promise = database.get_objects(user_id, collection_name,
    {deleted_on: {$exists: true}}, {"name": true})
  .then(function(accounts_JSON) {

    var accounts = [];

    for(var account_index = 0; account_index < accounts_JSON.length;
      account_index++) {

      var account = exports.create_account(user_id);
      account.from_JSON(accounts_JSON[account_index]);

      accounts.push(account);
    }

    return accounts;
  });

  return promise;
};

exports.get_account_by_id = function(user_id, account_id) {

  var promise = database.get_object_by_id(user_id, collection_name, account_id)
  .then(function(account_JSON) {

    var account = exports.create_account(user_id);
    account.from_JSON(account_JSON);

    return account;
  });

  return promise;
};
