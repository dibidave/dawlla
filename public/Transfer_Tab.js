function Transfer_Tab(tab_header_div, tab_content_div, connector) {

  this.tab_header = Tab_Header("Transfers", "#transfers", tab_header_div,
    false);

  this.tab_content_div = tab_content_div;
  this.connector = connector;

  this.tab_content = document.createElement("div");
  this.tab_content.setAttribute("id", "transfers");
  this.tab_content.className = "tab-pane fade show";

  this.generate_add_transfer_div();

  this.tab_content_div.appendChild(this.tab_content);

  this.transfers_table_div = document.createElement("div");
  this.transfers_table_div.className = "col-sm-12";
  this.tab_content.appendChild(this.transfers_table_div);

  var promises = [
    this.update_accounts(),
  ];

  Promise.all(promises).then(function() {
    this.update_transfers();
  }.bind(this));
};

Transfer_Tab.prototype.generate_add_transfer_div = function() {

  this.add_transfer_div = document.createElement("div");
  this.add_transfer_div.className = "col-sm-8";

  // The transfer date field row
  this.transfer_date_row = document.createElement("div");
  this.transfer_date_row.className = "pt-3 pb-1 row";

  this.transfer_date_label = document.createElement("label");
  this.transfer_date_label.className = "label label-default col-sm-3";
  this.transfer_date_label.innerHTML = "Transfer Date";

  this.transfer_date_row.appendChild(this.transfer_date_label);

  this.transfer_date_field = document.createElement("input");
  this.transfer_date_field.className = "col-sm-6";
  this.transfer_date_picker = flatpickr(this.transfer_date_field,
    {
      defaultDate: new Date(),
      disableMobile: true
    }
  );

  this.transfer_date_row.appendChild(this.transfer_date_field);

  this.add_transfer_div.appendChild(this.transfer_date_row);

  // The transfer from account field row
  this.transfer_from_account_row = document.createElement("div");
  this.transfer_from_account_row.className = "row py-1";

  this.transfer_from_account_label = document.createElement("label");
  this.transfer_from_account_label.className = "label label-default col-sm-3";
  this.transfer_from_account_label.innerHTML = "From Account";

  this.transfer_from_account_row.appendChild(this.transfer_from_account_label);

  this.from_account_field_div = document.createElement("div");
  this.from_account_field_div.className = "col-sm-6 px-0";

  this.from_account_field = document.createElement("select");
  this.from_account_field.className = "js-example-basic"
  this.from_account_field.id = "new_transfer_from_account_select";

  this.from_account_field_div.appendChild(this.from_account_field);

  this.transfer_from_account_row.appendChild(this.from_account_field_div);

  this.add_transfer_div.appendChild(this.transfer_from_account_row);

  // The transfer from account field row
  this.transfer_to_account_row = document.createElement("div");
  this.transfer_to_account_row.className = "row py-1";

  this.transfer_to_account_label = document.createElement("label");
  this.transfer_to_account_label.className = "label label-default col-sm-3";
  this.transfer_to_account_label.innerHTML = "To Account";

  this.transfer_to_account_row.appendChild(this.transfer_to_account_label);

  this.to_account_field_div = document.createElement("div");
  this.to_account_field_div.className = "col-sm-6 px-0";

  this.to_account_field = document.createElement("select");
  this.to_account_field.className = "js-example-basic"
  this.to_account_field.id = "new_transfer_to_account_select";

  this.to_account_field_div.appendChild(this.to_account_field);

  this.transfer_to_account_row.appendChild(this.to_account_field_div);

  this.add_transfer_div.appendChild(this.transfer_to_account_row);

  // The transfer amount field row
  this.transfer_amount_row = document.createElement("div");
  this.transfer_amount_row.className = "py-1 row";

  this.transfer_amount_label = document.createElement("label");
  this.transfer_amount_label.className = "label label-default col-sm-3";
  this.transfer_amount_label.innerHTML = "Amount";

  this.transfer_amount_row.appendChild(this.transfer_amount_label);

  this.transfer_amount_field = document.createElement("input");
  this.transfer_amount_field.className = "col-sm-6";
  this.transfer_amount_field.type = "number";
  this.transfer_amount_row.appendChild(this.transfer_amount_field);

  this.add_transfer_div.appendChild(this.transfer_amount_row);

  // The transfer description field row
  this.transfer_description_row = document.createElement("div");
  this.transfer_description_row.className = "py-1 row";

  this.transfer_description_label = document.createElement("label");
  this.transfer_description_label.className = "label label-default col-sm-3";
  this.transfer_description_label.innerHTML = "Description";

  this.transfer_description_row.appendChild(this.transfer_description_label);

  this.transfer_description_field = document.createElement("input");
  this.transfer_description_field.className = "col-sm-6";
  this.transfer_description_row.appendChild(this.transfer_description_field);

  this.add_transfer_div.appendChild(this.transfer_description_row);

  // The transfer post date field
  this.transfer_post_date_row = document.createElement("div");
  this.transfer_post_date_row.className = "py-1 row";

  this.transfer_post_date_label = document.createElement("label");
  this.transfer_post_date_label.className = "label label-default col-sm-3";
  this.transfer_post_date_label.innerHTML = "Post Date";

  this.transfer_post_date_row.appendChild(this.transfer_post_date_label);

  this.transfer_post_date_field = document.createElement("input");
  this.transfer_post_date_field.className = "col-sm-6";
  this.transfer_post_date_picker = flatpickr(this.transfer_post_date_field,
    {
      disableMobile: true
    });
  this.transfer_post_date_row.appendChild(this.transfer_post_date_field);

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

  this.transfer_post_date_row.appendChild(this.post_date_now_checkbox_div);

  this.add_transfer_div.appendChild(this.transfer_post_date_row);

  // The add transfer button
  this.add_transfer_button = document.createElement("button");
  this.add_transfer_button.className = "btn btn-primary";
  this.add_transfer_button.setAttribute("type","button");
  this.add_transfer_button.innerHTML = "Add";
  this.add_transfer_button.addEventListener("click",
    this.add_transfer_clicked.bind(this));

  this.add_transfer_div.appendChild(this.add_transfer_button);
  this.tab_content.appendChild(this.add_transfer_div);

  $(document).ready(function() {
    $(".js-example-basic").select2({width: "100%"});
  });
};

Transfer_Tab.prototype.update_accounts = function() {

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

Transfer_Tab.prototype.add_transfer_clicked = function() {

  var selected_from_account_index = 
    $('#new_transfer_from_account_select').find(':selected')[0].index;
  var selected_to_account_index = 
    $('#new_transfer_to_account_select').find(':selected')[0].index;

  if(selected_from_account_index == selected_to_account_index) {
    alert("Cannot transfer to same account");
    return;
  }

  var promise = Promise.resolve();

  var post_now = document.getElementById("post_date_now_checkbox").checked;

  promise = promise
  .then(function() {
  
    var transfer_date = this.transfer_date_picker.selectedDates[0];
    var from_account = this.accounts[selected_from_account_index];
    var to_account = this.accounts[selected_to_account_index];
    var amount = parseFloat(this.transfer_amount_field.value);

    if(isNaN(amount)) {
      alert("Error: must specify valid amount");
      return;
    }

    var description = this.transfer_description_field.value;

    var post_date = null;

    if(post_now) {
      post_date = new Date();
    }
    else if(this.transfer_post_date_picker.selectedDates.length >= 1) {
      post_date = this.transfer_post_date_picker.selectedDates[0];
    }
    
    var transfer_JSON = {
      date: transfer_date,
      from_account_id: from_account._id,
      to_account_id: to_account._id,
      amount: amount,
      description: description,
      post_date: post_date
    };

    return this.connector.post_transfer(transfer_JSON);
  }.bind(this))
  .then(function(transfer) {
    this.transfers.push(transfer);
    return this.update_transfers_table();
  }.bind(this));

};

Transfer_Tab.prototype.update_transfers = function() {

  var promise = this.connector.get_transfers()
  .then(function(transfers) {

    this.transfers = transfers;
    this.update_transfers_table();

    return Promise.resolve();
  }.bind(this));

  return promise;
};

Transfer_Tab.prototype.update_accounts_dropdown = function() {

  for(var account_index = 0; account_index < this.accounts.length;
    account_index++) {

    var account = this.accounts[account_index];

    var option = new Option(account.name, account._id, false, false);

    $("#new_transfer_from_account_select").append(option).trigger("change");

    var option = new Option(account.name, account._id, false, false);
    $("#new_transfer_to_account_select").append(option).trigger("change");
  }
};

Transfer_Tab.prototype.update_transfers_table = function() {

  while(this.transfers_table_div.firstChild) {
    this.transfers_table_div.removeChild(
      this.transfers_table_div.firstChild);
  }

  if(this.transfers.length === 0) {
    return;
  }

  this.transfers_table = document.createElement("table");
  this.transfers_table.className = "table-condensed table-striped table-bordered";

  this.transfers_table_header = document.createElement("thead");

  var header_row = document.createElement("tr");
  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Date";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "From Account";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "To Account";
  header_row.appendChild(cell);

  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Amount";
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

  this.transfers_table_header.appendChild(header_row);
  this.transfers_table.appendChild(this.transfers_table_header);

  this.transfers_table_body = document.createElement("tbody");

  for(var transfer_index = 0; transfer_index < this.transfers.length;
    transfer_index++) {

    var transfer = this.transfers[transfer_index];

    var row = document.createElement("tr");
    row.className = "table-active";

    var cell = document.createElement("td");
    cell.innerHTML = new Date(transfer.date).toLocaleString();
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = this.accounts_map[transfer.from_account_id].name;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = this.accounts_map[transfer.to_account_id].name;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = convert_number_to_dollars(transfer.amount);
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = transfer.description
    row.appendChild(cell);

    var cell = document.createElement("td");
    if(transfer.post_date !== null) {
      cell.innerHTML = 
        new Date(transfer.post_date).toISOString().split('T')[0]
    }

    row.appendChild(cell);

    var cell = document.createElement("td");

    if(transfer.post_date === null) {
      var post_button = document.createElement("button");
      post_button.className = "btn btn-primary";
      post_button.setAttribute("type","button");
      post_button.innerHTML = "Post";
      post_button.addEventListener("click",
        this.post_transfer_clicked.bind(this, transfer));

      cell.appendChild(post_button);
    }

    row.appendChild(cell);

    var cell = document.createElement("td");

    var delete_button = document.createElement("button");
    delete_button.className = "btn btn-primary";
    delete_button.setAttribute("type","button");
    delete_button.innerHTML = "X";
    delete_button.addEventListener("click",
      this.delete_transfer_clicked.bind(this, transfer));

    cell.appendChild(delete_button);
    row.appendChild(cell);

    this.transfers_table_body.appendChild(row);
  }

  this.transfers_table.appendChild(this.transfers_table_body);
  this.transfers_table_div.appendChild(this.transfers_table);
};

Transfer_Tab.prototype.post_transfer_clicked = function(transfer) {

  transfer.post_date = new Date();

  this.connector.post_transfer(transfer)
  .then(function() {
    this.update_transfers();
  }.bind(this));
};

Transfer_Tab.prototype.delete_transfer_clicked = function(transfer) {

  transfer.deleted_on = new Date();

  this.connector.post_transfer(transfer)
  .then(function() {
    this.update_transfers();
  }.bind(this));

};