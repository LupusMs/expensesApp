function obtainAPIKey() {
  let apiKey = localStorage.getItem('apiKey');

  if (apiKey === 'null') {
    apiKey = prompt('API Key');
    localStorage.setItem('apiKey', apiKey);
  }

  return apiKey;
}

function getData(apiKey) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://expenses-4c37.restdb.io/rest/february-2020');
  xhr.setRequestHeader('x-apikey', apiKey);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.status !== 200) {
      alert(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      const items = [];
      items.push("<table class='table'>");
      items.push('<tr><th>Item</th>');
      items.push('<th>Price</th></tr>');
      const data = this.response[0];
      // eslint-disable-next-line no-restricted-syntax
      for (const item in data) {
        if (item === '_id') {
          // eslint-disable-next-line no-continue
          continue;
        }
        items.push(`<tr><td>${item}</td><td>${data[item]}</td></tr>`);
      }
      items.push("<tr><td><input id='newItemName' class='form-control' type='text' placeholder='New Item'></td>");
      items.push("<td><input id='newItemPrice' class='form-control' type='text' placeholder='Price'></td></tr>");
      items.push('</table>');
      items.push("<button type='submit' class='btn btn-primary btn-lg btn-block' onclick='addItem()'>Submit</button>");
      document.getElementById('test').innerHTML = items.join('');
    }
  };

  xhr.onerror = function () {
    localStorage.setItem('apiKey', 'null');
    const newApiKey = obtainAPIKey();
    getData(newApiKey);
  };
  xhr.send();
}

// eslint-disable-next-line no-unused-vars
function addItem() {
  alert(`Adding new item ${$('#newItemName').val()} with price: ${Number($('#newItemPrice').val())}`);
}

// eslint-disable-next-line no-unused-vars
function init() {
  const apiKey = obtainAPIKey();
  getData(apiKey);
}
