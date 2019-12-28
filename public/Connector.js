function Connector(obj) {
    this.base_URL = obj.base_URL;
};

function get_URL(URL) {
  var promise = new Promise(function(resolve, reject) {
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: URL,
      cache: false,
      error: function(jqXHR, status, error) {
        return reject(error);
      },
      success: function(response) {
        return resolve(response);
      }
    });
  });
  return promise;
};

function post_URL(URL, data) {

  var data_JSON = JSON.stringify(data);

  var promise = new Promise(function(resolve, reject) {
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=UTF-8',
      url: URL,
      data: data_JSON,
      error: function(jqXHR, status, error) {
        return reject(error);
      },
      success: function(response, text_status) {
        return resolve(response);
      }
    });
  });

  return promise;
};

Connector.prototype.post_account = function(account) {
  var URL = this.base_URL + "/accounts";

  var promise = post_URL(URL, account)
    .then(function(response) {
      return response;
    });

  return promise;

};

Connector.prototype.get_accounts = function() {
  var URL = this.base_URL + "/accounts";

  var promise = get_URL(URL)
    .then(function(response) {
      return response.accounts;
    });

  return promise;

};

Connector.prototype.post_category = function(category) {
  var URL = this.base_URL + "/categories";

  var promise = post_URL(URL, category)
    .then(function(response) {
      return response;
    });

  return promise;

};

Connector.prototype.get_categories = function() {
  var URL = this.base_URL + "/categories";

  var promise = get_URL(URL)
    .then(function(response) {
      return response.categories;
    });

  return promise;
};

Connector.prototype.post_legal_entity = function(legal_entity) {
  var URL = this.base_URL + "/legal_entities";

  var promise = post_URL(URL, legal_entity)
    .then(function(response) {
      return response;
    });

  return promise;

};

Connector.prototype.get_legal_entities = function() {
  var URL = this.base_URL + "/legal_entities";

  var promise = get_URL(URL)
    .then(function(response) {
      return response.legal_entities;
    });

  return promise;
};

Connector.prototype.post_transaction = function(transaction) {
  var URL = this.base_URL + "/transactions";

  var promise = post_URL(URL, transaction)
    .then(function(response) {
      return response.transaction;
    });

  return promise;

};

Connector.prototype.get_transactions = function() {
  var URL = this.base_URL + "/transactions";

  var promise = get_URL(URL)
    .then(function(response) {
      return response.transactions;
    });

  return promise;
};

Connector.prototype.post_transfer = function(transfer) {
  var URL = this.base_URL + "/transfers";

  var promise = post_URL(URL, transfer)
    .then(function(response) {
      return response.transfer;
    });

  return promise;

};

Connector.prototype.get_transfers = function() {
  var URL = this.base_URL + "/transfers";

  var promise = get_URL(URL)
    .then(function(response) {
      return response.transfers;
    });

  return promise;
};

Connector.prototype.get_session = function() {

  var URL = this.base_URL + "/session";

  var promise = get_URL(URL)
    .then(function(response) {
      return response.session;
    });

  return promise;
};

Connector.prototype.post_login = function(username, password) {

  var URL = this.base_URL + "/login";

  var promise = post_URL(URL, {
    username: username,
    password: password
  }).then(function(response) {
    return response;
  });

  return promise;
};
