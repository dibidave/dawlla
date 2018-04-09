function Home_Tab(tab_header_div, tab_content_div, connector) {

  this.tab_header = Tab_Header("Home", "#home", tab_header_div, true);

  this.tab_content_div = tab_content_div;
  this.connector = connector;

  this.tab_content = document.createElement("div");
  this.tab_content.setAttribute("id", "home");
  this.tab_content.className = "tab-pane fade active show";

  this.objective_description_div = document.createElement("div");
  this.objective_description_div.className = "col-sm-8";

  this.objective_description_field = document.createElement('input');
  this.objective_description_field.className = "form-control";
  this.objective_description_field.setAttribute("id", 
    "objective_description_field");
  this.objective_description_field.setAttribute("placeholder",
    "Description");

  this.objective_description_div.appendChild(
    this.objective_description_field);
  this.tab_content.appendChild(this.objective_description_div);

  this.add_objective_div = document.createElement("div");
  this.add_objective_div.className = "col-sm-2"

  this.add_objective_button = document.createElement("button");
  this.add_objective_button.className = "btn btn-primary";
  this.add_objective_button.setAttribute("type","button");
  this.add_objective_button.innerHTML = "Add Objective";
  this.add_objective_button.addEventListener("click",
    this.add_objective_clicked.bind(this));

  this.add_objective_div.appendChild(this.add_objective_button);
  this.tab_content.appendChild(this.add_objective_div);

  this.tab_content_div.appendChild(this.tab_content);

};

Home_Tab.prototype.add_objective_clicked = function() {
  
  var objective_JSON = {
    description: objective_description_field.value
  };

  this.connector.post_objective(objective_JSON);

};