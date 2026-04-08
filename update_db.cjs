const fs = require('fs');

const data = JSON.parse(fs.readFileSync('database.json', 'utf8'));

const updatedData = data.map(item => {
  return {
    ...item,
    transactionType: "Venda"
  };
});

fs.writeFileSync('database.json', JSON.stringify(updatedData, null, 2));
console.log("Updated database.json");
