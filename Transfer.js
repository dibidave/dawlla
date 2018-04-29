var Database_Object = require("dijible-lib/Database_Object");
var database = require("dijible-lib/connectors/database");
var Account = require("./Account");

const collection_name = "Transfers";

const Transfer = {

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
      return Promise.all([
        Account.get_account_by_id(this._metadata.user_id, this.from_account_id),
        Account.get_account_by_id(this._metadata.user_id, this.to_account_id)]);
    }.bind(this))
    .then(function(accounts) {

      from_account = accounts[0];
      to_account = accounts[1];
    
      // If the original object didn't exist, we adjust the account's balance
      // by this transfer amount
      if(original_object === null) {
        from_account.balance -= this.amount;
        to_account.balance += this.amount;

        if(this.post_date !== null) {
          from_account.available_balance -= this.amount;
          to_account.available_balance += this.amount;
        }

        return Promise.all([from_account.save(), to_account.save()]);
      }
      else {

        if(original_object.deleted_on === null && this.deleted_on !== null) {

          from_account.balance += this.amount;
          to_account.balance -= this.amount;

          if(original_object.post_date !== null) {
            from_account.available_balance += this.amount;
            to_account.available_balance -= this.amount;
          }

          return Promise.all([from_account.save(), to_account.save()]);
        }
        // If this is a newly posted transfer, adjust the available
        // balance
        else if(original_object.post_date === null && this.post_date !== null) {
          from_account.available_balance -= this.amount;
          to_account.available_balance += this.amount;

          return Promise.all([from_account.save(), to_account.save()]);
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

exports.create_transfer = function(user_id, transfer_JSON) {

  var transfer = Database_Object.create_database_object(user_id,
    collection_name);
  Object.assign(transfer, Transfer);

  transfer.deleted_on = null;

  transfer.from_JSON(transfer_JSON);

  return transfer;
};

exports.get_transfers = function(user_id) {

  var not_deleted_filter = {
    deleted_on: {
      $eq: null
    }
  };

  var promise = database.get_objects(user_id, collection_name,
    not_deleted_filter)
  .then(function(transfers_JSON) {

    var transfers = [];

    for(var transfer_index = 0; transfer_index < transfers_JSON.length;
      transfer_index++) {

      var transfer = exports.create_transfer(user_id);
      transfer.from_JSON(transfers_JSON[transfer_index]);

      transfers.push(transfer);
    }

    return transfers;
  });

  return promise;
};