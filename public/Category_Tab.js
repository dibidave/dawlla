function Category_Tab(tab_header_div, tab_content_div, connector) {

  this.tab_header = Tab_Header("Categories", "#categories", tab_header_div, false);

  this.tab_content_div = tab_content_div;
  this.connector = connector;

  this.tab_content = document.createElement("div");
  this.tab_content.setAttribute("id", "categories");
  this.tab_content.className = "tab-pane fade show";

  this.category_name_div = document.createElement("div");
  this.category_name_div.className = "col-sm-8";

  this.category_name_field = document.createElement("input");
  this.category_name_field.className = "form-control";
  this.category_name_field.setAttribute("id", 
    "category_name_field");
  this.category_name_field.setAttribute("placeholder",
    "Description");

  this.category_name_div.appendChild(
    this.category_name_field);
  this.tab_content.appendChild(this.category_name_div);

  this.add_category_div = document.createElement("div");
  this.add_category_div.className = "col-sm-2"

  this.add_category_button = document.createElement("button");
  this.add_category_button.className = "btn btn-primary";
  this.add_category_button.setAttribute("type","button");
  this.add_category_button.innerHTML = "Add Category";
  this.add_category_button.addEventListener("click",
    this.add_category_clicked.bind(this));

  this.add_category_div.appendChild(this.add_category_button);
  this.tab_content.appendChild(this.add_category_div);

  this.tab_content_div.appendChild(this.tab_content);

  this.categories_table_div = document.createElement("div");
  this.categories_table_div.className = "col-sm-12";
  this.tab_content.appendChild(this.categories_table_div);

  this.update_categories();
};

Category_Tab.prototype.add_category_clicked = function() {
  
  var category_JSON = {
    name: category_name_field.value
  };

  this.connector.post_category(category_JSON)
  .then(function(response) {
    return this.update_categories();
  }.bind(this));

};

Category_Tab.prototype.update_categories = function() {

  var promise = this.connector.get_categories()
  .then(function(categories) {
    this.categories = categories;
    this.update_categories_table();

    return Promise.resolve();
  }.bind(this));

  return promise;
}

Category_Tab.prototype.update_categories_table = function() {

  while(this.categories_table_div.firstChild) {
    this.categories_table_div.removeChild(this.categories_table_div.firstChild);
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

  this.categories_table_header.appendChild(header_row)
  this.categories_table.appendChild(this.categories_table_header);

  this.categories_table_body = document.createElement("tbody");

  for(var category_index = 0; category_index < this.categories.length;
    category_index++) {

    var category = this.categories[category_index];

    var row = document.createElement("tr");
    row.className = "table-active";
    var cell = document.createElement("td");
    cell.innerHTML = category.name;
    row.appendChild(cell);

    this.categories_table_body.appendChild(row);
  }

  this.categories_table.appendChild(this.categories_table_body);
  this.categories_table_div.appendChild(this.categories_table);
};