
var dollar_formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function convert_number_to_dollars(number) {
  return dollar_formatter.format(number);
};

function csv_escape(value) {

  if(value === null || value === undefined) {
    return "";
  }

  var csv_value = value.toString();

  if(csv_value.indexOf("\"") >= 0) {
    csv_value = csv_value.replace(/"/g, "\"\"");
  }

  if(csv_value.indexOf(",") >= 0 || csv_value.indexOf("\n") >= 0 ||
    csv_value.indexOf("\"") >= 0) {
    csv_value = "\"" + csv_value + "\"";
  }

  return csv_value;
};

function csv_date(value) {

  if(value === null || value === undefined || value === "") {
    return "";
  }

  return new Date(value).toISOString();
};

function download_csv(filename, headers, rows) {

  var csv_lines = [
    headers.map(csv_escape).join(",")
  ];

  for(var row_index = 0; row_index < rows.length; row_index++) {
    csv_lines.push(rows[row_index].map(csv_escape).join(","));
  }

  var csv_blob = new Blob([csv_lines.join("\n")], {
    type: "text/csv;charset=utf-8;"
  });
  var csv_url = URL.createObjectURL(csv_blob);
  var link = document.createElement("a");

  link.setAttribute("href", csv_url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(csv_url);
};