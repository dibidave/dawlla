function Account_Tab(tab_header_div, tab_content_div, connector) {

  this.tab_header = Tab_Header("Accounts", "#accounts", tab_header_div, false);

  this.tab_content_div = tab_content_div;
  this.connector = connector;

  this.tab_content = document.createElement("div");
  this.tab_content.setAttribute("id", "accounts");
  this.tab_content.className = "tab-pane fade show";

  this.account_name_div = document.createElement("div");
  this.account_name_div.className = "col-sm-8";

  this.account_name_field = document.createElement("input");
  this.account_name_field.className = "form-control";
  this.account_name_field.setAttribute("id", 
    "account_name_field");
  this.account_name_field.setAttribute("placeholder",
    "Description");

  this.account_name_div.appendChild(
    this.account_name_field);
  this.tab_content.appendChild(this.account_name_div);

  this.add_account_div = document.createElement("div");
  this.add_account_div.className = "col-sm-2"

  this.add_account_button = document.createElement("button");
  this.add_account_button.className = "btn btn-primary";
  this.add_account_button.setAttribute("type","button");
  this.add_account_button.innerHTML = "Add Account";
  this.add_account_button.addEventListener("click",
    this.add_account_clicked.bind(this));

  this.add_account_div.appendChild(this.add_account_button);
  this.tab_content.appendChild(this.add_account_div);

  this.tab_content_div.appendChild(this.tab_content);

  this.accounts_table_div = document.createElement("div");
  this.accounts_table_div.className = "col-sm-12";
  this.tab_content.appendChild(this.accounts_table_div);

  this.update_accounts();
};

Account_Tab.prototype.add_account_clicked = function() {
  
  var account_JSON = {
    name: account_name_field.value
  };

  this.connector.post_account(account_JSON)
  .then(function(response) {
    return this.update_accounts();
  }.bind(this));

};

Account_Tab.prototype.update_accounts = function() {

  var promise = this.connector.get_accounts()
  .then(function(accounts) {
    this.accounts = accounts;
    this.update_accounts_table();

    return Promise.resolve();
  }.bind(this));

  return promise;
}

Account_Tab.prototype.update_accounts_table = function() {

  while(this.accounts_table_div.firstChild) {
    this.accounts_table_div.removeChild(this.accounts_table_div.firstChild);
  }

  if(this.accounts.length === 0) {
    return;
  }

  this.accounts_table = document.createElement("table");
  this.accounts_table.className = "table";

  this.accounts_table_header = document.createElement("thead");

  var header_row = document.createElement("tr");
  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Account"
  header_row.appendChild(cell);

  cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Balance";
  header_row.appendChild(cell);

  cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Available";
  header_row.appendChild(cell);

  this.accounts_table_header.appendChild(header_row)
  this.accounts_table.appendChild(this.accounts_table_header);

  this.accounts_table_body = document.createElement("tbody");

  for(var account_index = 0; account_index < this.accounts.length;
    account_index++) {

    var account = this.accounts[account_index];

    var row = document.createElement("tr");
    row.className = "table-active";
    var cell = document.createElement("td");
    cell.innerHTML = account.name;
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.innerHTML = account.balance;
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.innerHTML = account.available_balance;
    row.appendChild(cell);

    this.accounts_table_body.appendChild(row);
  }

  this.accounts_table.appendChild(this.accounts_table_body);
  this.accounts_table_div.appendChild(this.accounts_table);
};