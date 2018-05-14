var Database_Object = require("dijible-lib/Database_Object");
var database = require("dijible-lib/connectors/database");
var Account = require("./Account");

const collection_name = "Transactions";

const Transaction = {

  from_JSON(JSON_object) {

    Database_Object.Database_Object.from_JSON.call(this, JSON_object);

    this.date = new Date(this.date);

    if(this.post_date !== null) {
      this.post_date = new Date(this.post_date);
    }
  },

  save() {

    var promise = Promise.resolve();

    var original_object = null;

    if(this._id !== undefined) {
      promise = database.get_object_by_id(this._metadata.user_id,
        collection_name, this._id)
      .then(function(response) {
        original_object = response;
      });
    }

    promise = promise
    .then(function() {
      return Database_Object.Database_Object.save.call(this);
    }.bind(this))
    .then(function() {
      return Account.get_account_by_id(this._metadata.user_id, 
        this.account_id);
    }.bind(this))
    .then(function(account) {
    
      // If the original object didn't exist, we adjust the account's balance
      // by this transaction amount
      if(original_object === null) {
        account.balance += this.amount;

        if(this.post_date !== null) {
          account.available_balance += this.amount;
        }

        return account.save();
      }
      else {

        if(original_object.deleted_on === null && this.deleted_on !== null) {

          account.balance -= this.amount;

          if(original_object.post_date !== null) {
            account.available_balance -= this.amount;
          }

          return account.save();
        }
        // If this is a newly posted transaction, adjust the available
        // balance
        else if(original_object.post_date === null && this.post_date !== null) {
          account.available_balance += this.amount;

          return account.save()
        }
      }

      return Promise.resolve();
    }.bind(this))
    .then(function() {
      return this;
    }.bind(this));

    return promise;
  }

};

exports.create_transaction = function(user_id, transaction_JSON) {

  var transaction = Database_Object.create_database_object(user_id,
    collection_name);
  Object.assign(transaction, Transaction);

  transaction.deleted_on = null;

  transaction.from_JSON(transaction_JSON);

  return transaction;
};

exports.get_transactions = function(user_id) {

  var not_deleted_filter = {
    deleted_on: {
      $eq: null
    }
  };

  var promise = database.get_objects(user_id, collection_name,
    not_deleted_filter, {"date": false})
  .then(function(transactions_JSON) {

    var transactions = [];

    for(var transaction_index = 0; transaction_index < transactions_JSON.length;
      transaction_index++) {

      var transaction = exports.create_transaction(user_id);
      transaction.from_JSON(transactions_JSON[transaction_index]);

      transactions.push(transaction);
    }

    return transactions;
  });

  return promise;
};