function Transaction_Tab(tab_header_div, tab_content_div, connector) {

  this.tab_header = Tab_Header("Transactions", "#transactions", tab_header_div,
    false);

  this.tab_content_div = tab_content_div;
  this.connector = connector;

  this.tab_content = document.createElement("div");
  this.tab_content.setAttribute("id", "transactions");
  this.tab_content.className = "tab-pane fade show";

  this.generate_add_transaction_div();

  this.tab_content_div.appendChild(this.tab_content);

  this.transactions_table_div = document.createElement("div");
  this.transactions_table_div.className = "col-sm-12";
  this.tab_content.appendChild(this.transactions_table_div);

  var promises = [
    this.update_accounts(),
    this.update_categories(),
    this.update_parties()
  ];

  Promise.all(promises).then(function() {
    this.update_transactions();
  }.bind(this));
};

Transaction_Tab.prototype.generate_add_transaction_div = function() {

  this.add_transaction_div = document.createElement("div");
  this.add_transaction_div.className = "col-sm-8";

  // The transaction date field row
  this.transaction_date_row = document.createElement("div");
  this.transaction_date_row.className = "pt-3 pb-1 row";

  this.transaction_date_label = document.createElement("label");
  this.transaction_date_label.className = "label label-default col-sm-3";
  this.transaction_date_label.innerHTML = "Transaction Date";

  this.transaction_date_row.appendChild(this.transaction_date_label);

  this.transaction_date_field = document.createElement("input");
  this.transaction_date_field.className = "col-sm-6";
  this.transaction_date_picker = flatpickr(this.transaction_date_field,
    {
      defaultDate: new Date(),
      disableMobile: true
    }
  );

  this.transaction_date_row.appendChild(this.transaction_date_field);

  this.add_transaction_div.appendChild(this.transaction_date_row);

  // The transaction party field row
  this.transaction_party_row = document.createElement("div");
  this.transaction_party_row.className = "py-1 row";

  this.transaction_party_label = document.createElement("label");
  this.transaction_party_label.className = "label label-default col-sm-3";
  this.transaction_party_label.innerHTML = "Party";

  this.transaction_party_row.appendChild(this.transaction_party_label);

  this.party_field_div = document.createElement("div");
  this.party_field_div.className = "col-sm-6 px-0";

  this.party_field = document.createElement("select");
  this.party_field.className = "js-example-tags"
  this.party_field.id = "new_transaction_party_select";

  this.party_field_div.appendChild(this.party_field);

  this.transaction_party_row.appendChild(this.party_field_div);

  this.add_transaction_div.appendChild(this.transaction_party_row);

  // The transaction account field row
  this.transaction_account_row = document.createElement("div");
  this.transaction_account_row.className = "row py-1";

  this.transaction_account_label = document.createElement("label");
  this.transaction_account_label.className = "label label-default col-sm-3";
  this.transaction_account_label.innerHTML = "Account";

  this.transaction_account_row.appendChild(this.transaction_account_label);

  this.account_field_div = document.createElement("div");
  this.account_field_div.className = "col-sm-6 px-0";

  this.account_field = document.createElement("select");
  this.account_field.className = "js-example-basic"
  this.account_field.id = "new_transaction_account_select";

  this.account_field_div.appendChild(this.account_field);

  this.transaction_account_row.appendChild(this.account_field_div);

  this.add_transaction_div.appendChild(this.transaction_account_row);

  // The transaction amount field row
  this.transaction_amount_row = document.createElement("div");
  this.transaction_amount_row.className = "py-1 row";

  this.transaction_amount_label = document.createElement("label");
  this.transaction_amount_label.className = "label label-default col-sm-3";
  this.transaction_amount_label.innerHTML = "Amount";

  this.transaction_amount_row.appendChild(this.transaction_amount_label);

  this.transaction_amount_field = document.createElement("input");
  this.transaction_amount_field.className = "col-sm-6";
  this.transaction_amount_field.type = "number";
  this.transaction_amount_row.appendChild(this.transaction_amount_field);

  this.add_transaction_div.appendChild(this.transaction_amount_row);

  // The transaction description field row
  this.transaction_description_row = document.createElement("div");
  this.transaction_description_row.className = "py-1 row";

  this.transaction_description_label = document.createElement("label");
  this.transaction_description_label.className = "label label-default col-sm-3";
  this.transaction_description_label.innerHTML = "Description";

  this.transaction_description_row.appendChild(this.transaction_description_label);

  this.transaction_description_field = document.createElement("input");
  this.transaction_description_field.className = "col-sm-6";
  this.transaction_description_row.appendChild(this.transaction_description_field);

  this.add_transaction_div.appendChild(this.transaction_description_row);

  // The transaction category field row
  this.transaction_category_row = document.createElement("div");
  this.transaction_category_row.className = "py-1 row";

  this.transaction_category_label = document.createElement("label");
  this.transaction_category_label.className = "label label-default col-sm-3";
  this.transaction_category_label.innerHTML = "Category";

  this.transaction_category_row.appendChild(this.transaction_category_label);

  this.category_field_div = document.createElement("div");
  this.category_field_div.className = "col-sm-6 px-0";

  this.category_field = document.createElement("select");
  this.category_field.className = "js-example-basic"
  this.category_field.id = "new_transaction_category_select";

  this.category_field_div.appendChild(this.category_field);

  this.transaction_category_row.appendChild(this.category_field_div);

  this.add_transaction_div.appendChild(this.transaction_category_row);

  // The transaction post date field
  this.transaction_post_date_row = document.createElement("div");
  this.transaction_post_date_row.className = "py-1 row";

  this.transaction_post_date_label = document.createElement("label");
  this.transaction_post_date_label.className = "label label-default col-sm-3";
  this.transaction_post_date_label.innerHTML = "Post Date";

  this.transaction_post_date_row.appendChild(this.transaction_post_date_label);

  this.transaction_post_date_field = document.createElement("input");
  this.transaction_post_date_field.className = "col-sm-6";
  this.transaction_post_date_picker = flatpickr(this.transaction_post_date_field,
    {
      disableMobile: true
    });
  this.transaction_post_date_row.appendChild(this.transaction_post_date_field);

  this.post_date_now_checkbox_div = document.createElement("div");
  this.post_date_now_checkbox_div.className = "form-check col-sm-2 mx-1";

  this.post_date_now_checkbox_label = document.createElement("label");
  this.post_date_now_checkbox_label.className = "form-check-label";

  this.post_date_now_checkbox = document.createElement("input");
  this.post_date_now_checkbox.setAttribute("id", "post_date_now_checkbox");
  this.post_date_now_checkbox.className = "form-check-input";
  this.post_date_now_checkbox.type = "checkbox";

  this.post_date_now_checkbox_label.appendChild(this.post_date_now_checkbox);
  this.post_date_now_checkbox_label.innerHTML += "Now?";

  this.post_date_now_checkbox_div.appendChild(this.post_date_now_checkbox_label);

  this.transaction_post_date_row.appendChild(this.post_date_now_checkbox_div);

  this.add_transaction_div.appendChild(this.transaction_post_date_row);

  // The add transaction button
  this.add_transaction_button = document.createElement("button");
  this.add_transaction_button.className = "btn btn-primary";
  this.add_transaction_button.setAttribute("type","button");
  this.add_transaction_button.innerHTML = "Add";
  this.add_transaction_button.addEventListener("click",
    this.add_transaction_clicked.bind(this));

  this.add_transaction_div.appendChild(this.add_transaction_button);
  this.tab_content.appendChild(this.add_transaction_div);

  $(document).ready(function() {
    $(".js-example-basic").select2({width: "100%"});
    $("#new_transaction_party_select").select2(
      {
        width: "100%",
        tags: true
      });
  });
};

Transaction_Tab.prototype.update_accounts = function() {

  var promise = this.connector.get_accounts()
  .then(function(accounts) {
    this.accounts = accounts;
    this.update_accounts_dropdown();

    this.accounts_map = {};

    for(var account_index = 0; account_index < this.accounts.length;
      account_index++) {
      var account = this.accounts[account_index];

      this.accounts_map[account._id] = account;
    }

    return Promise.resolve();
  }.bind(this));

  return promise;
};

Transaction_Tab.prototype.update_categories = function() {

  var promise = this.connector.get_categories()
  .then(function(categories) {

    this.categories = categories;
    this.update_categories_dropdown();

    this.categories_map = {};

    for(var category_index = 0; category_index < this.categories.length;
      category_index++) {
      var category = this.categories[category_index];

      this.categories_map[category._id] = category;
    }

    return Promise.resolve();
  }.bind(this));

  return promise;
};

Transaction_Tab.prototype.update_parties = function() {

  var promise = this.connector.get_legal_entities()
  .then(function(legal_entities) {
    this.parties = legal_entities;
    this.update_parties_dropdown();

    this.parties_map = {};

    for(var party_index = 0; party_index < this.parties.length;
      party_index++) {
      var party = this.parties[party_index];

      this.parties_map[party._id] = party;
    }

    return Promise.resolve();
  }.bind(this));

  return promise;
};

Transaction_Tab.prototype.add_transaction_clicked = function() {

  var selected_party_index = 
    $('#new_transaction_party_select').find(':selected')[0].index;
  var selected_account_index = 
    $('#new_transaction_account_select').find(':selected')[0].index;

  var selected_category_index = 
    $('#new_transaction_category_select').find(':selected')[0].index;

  var promise = Promise.resolve();

  var post_now = document.getElementById("post_date_now_checkbox").checked;

  var party = null;

  if(selected_party_index >= this.parties.length) {

    var party_name = this.party_field.value;

    var party_JSON = {
      name: party_name
    };

    promise = promise
    .then(this.connector.post_legal_entity
      .bind(null, party_JSON)
    ).then(function(response) {
      party = response.legal_entity;
    });
  }
  else {
    party = this.parties[selected_party_index];
  }

  promise = promise
  .then(function() {
  
    var transaction_date = this.transaction_date_picker.selectedDates[0];
    var account = this.accounts[selected_account_index];
    var amount = parseFloat(this.transaction_amount_field.value);

    if(isNaN(amount)) {
      alert("Error: must specify valid amount");
      return;
    }

    var description = this.transaction_description_field.value;
    var category = this.categories[selected_category_index];

    var post_date = null;

    if(post_now) {
      post_date = new Date();
    }
    else if(this.transaction_post_date_picker.selectedDates.length >= 1) {
      post_date = this.transaction_post_date_picker.selectedDates[0];
    }
    
    var transaction_JSON = {
      date: transaction_date,
      party_id: party._id,
      account_id: account._id,
      amount: amount,
      description: description,
      category_id: category._id,
      post_date: post_date
    };

    return this.connector.post_transaction(transaction_JSON);
  }.bind(this))
  .then(function(transaction) {

    let transaction_date = new Date(transaction.date);

    for(var transaction_index = 0; transaction_index < this.transactions.length;
      transaction_index++) {

      let date_at_insert_location =
        new Date(this.transactions[transaction_index].date);

      if(date_at_insert_location < transaction_date) {
        this.transactions.splice(transaction_index, 0, transaction);
        break;
      }
    }
    
    return Promise.all([this.update_transactions_table(), 
      this.update_parties()]);
  }.bind(this));

};

Transaction_Tab.prototype.clear_fields = function() {

  this.transaction_amount_field.value = "";
  this.transaction_description_field.value = "";
  this.transaction_date_picker.setDate(new Date());
  this.transaction_post_date_field = "";
};

Transaction_Tab.prototype.update_transactions = function() {

  var promise = this.connector.get_transactions()
  .then(function(transactions) {

    this.transactions = transactions;
    this.update_transactions_table();

    return Promise.resolve();
  }.bind(this));

  return promise;
};

Transaction_Tab.prototype.update_accounts_dropdown = function() {

  $("#new_transaction_account_select").val(null).trigger("change");

  for(var account_index = 0; account_index < this.accounts.length;
    account_index++) {

    var account = this.accounts[account_index];

    var option = new Option(account.name, account._id, false, false);

    $("#new_transaction_account_select").append(option).trigger("change");
  }
};

Transaction_Tab.prototype.update_categories_dropdown = function() {

  $("#new_transaction_category_select").val(null).trigger("change");

  for(var category_index = 0; category_index < this.categories.length;
    category_index++) {

    var category = this.categories[category_index];

    var option = new Option(category.name, category._id, false, false);

    $("#new_transaction_category_select").append(option).trigger("change");
  }
};

Transaction_Tab.prototype.update_parties_dropdown = function() {

  $("#new_transaction_party_select").empty().trigger("change");

  for(var party_index = 0; party_index < this.parties.length;
    party_index++) {

    var party = this.parties[party_index];

    var option = new Option(party.name, party._id, false, false);

    $("#new_transaction_party_select").append(option).trigger("change");
  }
};

Transaction_Tab.prototype.update_transactions_table = function() {

  while(this.transactions_table_div.firstChild) {
    this.transactions_table_div.removeChild(
      this.transactions_table_div.firstChild);
  }

  if(this.transactions.length === 0) {
    return;
  }

  this.transactions_table = document.createElement("table");
  this.transactions_table.className = "table-condensed table-striped table-bordered";

  this.transactions_table_header = document.createElement("thead");

  var header_row = document.createElement("tr");
  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Date";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Party";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Account";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Amount";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Category";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Description";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Post Date";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Post";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "X";
  header_row.appendChild(cell);

  this.transactions_table_header.appendChild(header_row);
  this.transactions_table.appendChild(this.transactions_table_header);

  this.transactions_table_body = document.createElement("tbody");

  for(var transaction_index = 0; transaction_index < this.transactions.length;
    transaction_index++) {

    var transaction = this.transactions[transaction_index];

    if(!(transaction.account_id in this.accounts_map)) {
      continue;
    }

    var row = document.createElement("tr");
    row.className = "table-active";

    var cell = document.createElement("td");
    cell.innerHTML = new Date(transaction.date).toLocaleString();
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = this.parties_map[transaction.party_id].name;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = this.accounts_map[transaction.account_id].name;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = convert_number_to_dollars(transaction.amount);
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = this.categories_map[transaction.category_id].name;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = transaction.description
    row.appendChild(cell);

    var cell = document.createElement("td");
    if(transaction.post_date !== null) {
      cell.innerHTML = 
        new Date(transaction.post_date).toISOString().split('T')[0]
    }

    row.appendChild(cell);

    var cell = document.createElement("td");

    if(transaction.post_date === null) {
      var post_button = document.createElement("button");
      post_button.className = "btn btn-primary";
      post_button.setAttribute("type","button");
      post_button.innerHTML = "Post";
      post_button.addEventListener("click",
        this.post_transaction_clicked.bind(this, transaction));

      cell.appendChild(post_button);
    }

    row.appendChild(cell);

    var cell = document.createElement("td");

    var delete_button = document.createElement("button");
    delete_button.className = "btn btn-primary";
    delete_button.setAttribute("type","button");
    delete_button.innerHTML = "X";
    delete_button.addEventListener("click",
      this.delete_transaction_clicked.bind(this, transaction));

    cell.appendChild(delete_button);
    row.appendChild(cell);

    this.transactions_table_body.appendChild(row);
  }

  this.transactions_table.appendChild(this.transactions_table_body);
  this.transactions_table_div.appendChild(this.transactions_table);
};

Transaction_Tab.prototype.post_transaction_clicked = function(transaction) {

  if(this.transaction_post_date_picker.selectedDates.length >= 1) {
    transaction.post_date = this.transaction_post_date_picker.selectedDates[0];
  }
  else {
    transaction.post_date = new Date();
  }

  this.connector.post_transaction(transaction)
  .then(function() {
    this.update_transactions();
  }.bind(this));
};

Transaction_Tab.prototype.delete_transaction_clicked = function(transaction) {

  transaction.deleted_on = new Date();

  this.connector.post_transaction(transaction)
  .then(function() {
    this.update_transactions();
  }.bind(this));

};

