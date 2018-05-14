
var dollar_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

function convert_number_to_dollars(number) {
  return dollar_formatter.format(number);
};