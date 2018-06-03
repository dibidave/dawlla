function Analysis_Tab(tab_header_div, tab_content_div, connector) {

  this.tab_header = Tab_Header("Analysis", "#analysis", tab_header_div, false);

  this.tab_content_div = tab_content_div;
  this.connector = connector;

  this.tab_content = document.createElement("div");
  this.tab_content.setAttribute("id", "analysis");
  this.tab_content.className = "tab-pane fade show";

  this.analysis_filter_div = document.createElement("div");
  this.analysis_filter_div.className = "col-sm-8";

  // The start date field row
  this.start_date_row = document.createElement("div");
  this.start_date_row.className = "pt-3 pb-1 row";

  this.start_date_label = document.createElement("label");
  this.start_date_label.className = "label label-default col-sm-3";
  this.start_date_label.innerHTML = "Start Date";

  this.start_date_row.appendChild(this.start_date_label);

  this.start_date_field = document.createElement("input");
  this.start_date_field.className = "col-sm-6";
  this.start_date_picker = flatpickr(this.start_date_field,
    {
      defaultDate: null,
      disableMobile: true,
      onChange: this.update_filters.bind(this)
    }
  );

  this.start_date_row.appendChild(this.start_date_field);

  this.analysis_filter_div.appendChild(this.start_date_row);

  // The end date field row
  this.end_date_row = document.createElement("div");
  this.end_date_row.className = "pt-3 pb-1 row";

  this.end_date_label = document.createElement("label");
  this.end_date_label.className = "label label-default col-sm-3";
  this.end_date_label.innerHTML = "End Date";

  this.end_date_row.appendChild(this.end_date_label);

  this.end_date_field = document.createElement("input");
  this.end_date_field.className = "col-sm-6";
  this.end_date_picker = flatpickr(this.end_date_field,
    {
      defaultDate: null,
      disableMobile: true,
      onChange: this.update_filters.bind(this)
    }
  );

  this.end_date_row.appendChild(this.end_date_field);

  this.analysis_filter_div.appendChild(this.end_date_row);

  this.tab_content.appendChild(this.analysis_filter_div);

  this.analysis_table_div = document.createElement("div");
  this.analysis_table_div.className = "col-sm-12";
  this.tab_content.appendChild(this.analysis_table_div);

  this.tab_content_div.appendChild(this.tab_content);

  this.update_data();
};

Analysis_Tab.prototype.update_data = function() {

  var promise = this.connector.get_categories()
  .then(function(categories) {

    this.categories = categories;

    return this.connector.get_transactions();
  }.bind(this)).then(function(transactions) {

    this.transactions = transactions;

    return this.update_filters();
  }.bind(this));

  return promise;
}

Analysis_Tab.prototype.update_filters = function() {

  this.category_id_index_map = {};

  for(var category_index = 0; category_index < this.categories.length;
    category_index++) {

    var category = this.categories[category_index];

    this.category_id_index_map[category._id] = category_index;

    this.categories[category_index].income = 0;
    this.categories[category_index].expenses = 0;
  }

  var start_date = null;
  var end_date = null;

  if(this.start_date_picker.selectedDates.length >= 1) {
    start_date = this.start_date_picker.selectedDates[0];
  }

  if(this.end_date_picker.selectedDates.length >= 1) {

    end_date = new Date(this.end_date_picker.selectedDates[0].valueOf());
    end_date.setDate(end_date.getDate() + 1);
  }

  for(var transaction_index = 0; transaction_index < this.transactions.length;
    transaction_index++) {

    var transaction = this.transactions[transaction_index];

    var category_index = this.category_id_index_map[transaction.category_id];

    if(start_date !== null) {
      if(new Date(transaction.date) < start_date) {
        continue;
      }
    }

    if(end_date !== null) {

      if(new Date(transaction.date) >= end_date) {
        continue;
      }
    }

    if(transaction.amount > 0) {
      this.categories[category_index].income += transaction.amount;
    }
    else {
      this.categories[category_index].expenses += transaction.amount;
    }
  }

  return this.update_analysis_table();
}

Analysis_Tab.prototype.update_analysis_table = function() {

  while(this.analysis_table_div.firstChild) {
    this.analysis_table_div.removeChild(this.analysis_table_div.firstChild);
  }

  if(this.categories.length === 0) {
    return;
  }

  this.categories_table = document.createElement("table");
  this.categories_table.className = "table";

  this.categories_table_header = document.createElement("thead");

  var header_row = document.createElement("tr");
  var cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Category"
  header_row.appendChild(cell);

  cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Income"
  header_row.appendChild(cell);

  cell = document.createElement("th");
  cell.setAttribute("scope", "col");
  cell.innerHTML = "Expenses"
  header_row.appendChild(cell);

  this.categories_table_header.appendChild(header_row)
  this.categories_table.appendChild(this.categories_table_header);

  this.categories_table_body = document.createElement("tbody");

  var total_income = 0;
  var total_expenses = 0;

  for(var category_index = 0; category_index < this.categories.length;
    category_index++) {

    var category = this.categories[category_index];

    var row = document.createElement("tr");
    row.className = "table-active";
    var cell = document.createElement("td");
    cell.innerHTML = category.name;
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.innerHTML = convert_number_to_dollars(category.income);
    row.appendChild(cell);

    total_income += category.income;

    cell = document.createElement("td");
    cell.innerHTML = convert_number_to_dollars(category.expenses);
    row.appendChild(cell);

    total_expenses += category.expenses;

    this.categories_table_body.appendChild(row);
  }

  this.categories_table.appendChild(this.categories_table_body);

  this.analysis_table_footer = document.createElement("tfoot");

  var footer_row = document.createElement("tr");
  var cell = document.createElement("th");
  cell.innerHTML = "Total";
  footer_row.appendChild(cell);

  cell = document.createElement("th");
  cell.innerHTML = convert_number_to_dollars(total_income);
  footer_row.appendChild(cell);

  cell = document.createElement("th");
  cell.innerHTML = convert_number_to_dollars(total_expenses);
  footer_row.appendChild(cell);

  this.analysis_table_footer.appendChild(footer_row);
  this.categories_table.appendChild(this.analysis_table_footer);

  this.analysis_table_div.appendChild(this.categories_table);
};