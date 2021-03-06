function obtainAPIKey() {
  let apiKey = localStorage.getItem('apiKey');

  if (apiKey === 'null') {
    apiKey = prompt('API Key');
    localStorage.setItem('apiKey', apiKey);
  }

  return apiKey;
}

function getMonthYearParameter(monthYear) {
  if ((monthYear === undefined) || (!monthYear.match(/([a-z])-([0-9]{4})/g))) {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
    ];
    const today = new Date();
    const year = today.getFullYear();
    const month = monthNames[today.getMonth()];
    return `${month}-${year}`;
  }
  return monthYear;
}

function startAnimatingLoading() {
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('expenses-table').innerHTML = '';
  document.getElementById('submit-btn').style.visibility = 'hidden';
}

function stopAnimatingLoading() {
  document.getElementById('submit-btn').style.visibility = 'visible';
  document.getElementById('spinner').style.display = 'none';
}

function getMonthlyLimit(apiKey) {
  const url = 'https://expenses-4c37.restdb.io/rest/settings';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('x-apikey', apiKey);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.status !== 200) {
      alert(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      document.getElementById('monthlyLimit').value = this.response[0].monthly_limit;
      document.getElementById('daily_allowance').innerHTML = (this.response[0].monthly_limit) / 30;
    }
  };
  xhr.send();
}

function getData(apiKey, monthYear) {
  document.getElementById('dropdownMenuButton').innerHTML = monthYear;
  startAnimatingLoading();
  const monthYearParameter = getMonthYearParameter(monthYear);
  const url = `https://expenses-4c37.restdb.io/rest/${monthYearParameter}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
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
      const data = this.response;
      let totalExpenses = 0.0;
      data.forEach((element) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const item in element) {
          if (item === '_id') {
            // eslint-disable-next-line no-continue
            continue;
          }
          const itemPrice = element[item];
          items.push(`<tr><td>${item}</td><td>${itemPrice}</td></tr>`);
          totalExpenses += itemPrice;
        }
      });
      items.push("<tr><td><input id='newItemName' class='form-control' type='text' placeholder='New Item'></td>");
      items.push("<td><input id='newItemPrice' class='form-control' type='text' placeholder='Price'></td></tr>");
      items.push('</table>');
      items.unshift(`<div id="info-bar"><div id="total-expenses">Total Expenses: <b>${totalExpenses}</b></div>
       <div>Daily allowance: <b id="daily_allowance"></b></div></div>`);
      document.getElementById('expenses-table').innerHTML = items.join('');
      stopAnimatingLoading();
    }

    getMonthlyLimit(apiKey);
  };

  xhr.onerror = function () {
    localStorage.setItem('apiKey', 'null');
    const newApiKey = obtainAPIKey();
    getData(newApiKey);
  };
  xhr.send();
}

// eslint-disable-next-line no-unused-vars
function addItem(apiKey, monthYear) {
  const itemName = $('#newItemName').val();
  const itemPrice = $('#newItemPrice').val();
  if (itemName === '' || itemPrice === '') {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.setAttribute('role', 'alert');
    alert.innerHTML = 'Fields should not be empty!';
    document.getElementById('expenses-table').append(alert);
  } else {
    const url = `https://expenses-4c37.restdb.io/rest/${monthYear}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('x-apikey', apiKey);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.status !== 201) {
        alert(`Error ${xhr.status}: ${xhr.statusText}`);
      } else {
        getData(apiKey, monthYear);
      }
    };

    xhr.send(`{ "${$('#newItemName').val()}" : ${Number($('#newItemPrice').val())} }`);
    startAnimatingLoading();
  }
}

function loadDropdown(apiKey) {
  const url = 'https://expenses-4c37.restdb.io/rest/_meta';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('x-apikey', apiKey);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.status !== 200) {
      alert(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      const items = [];
      const data = this.response.collections;
      const ignoreItems = ['system_log', 'system_jobs', 'users', 'email_outbound', 'email_inbound', 'email_unsubscribed',
        'settings'];
      data.forEach((element) => {
        if (!ignoreItems.includes(element.name)) {
          items.push(`<a class="dropdown-item" href="javascript:getData('${apiKey}','${element.name}')">${element.name}</a>`);
        }
      });
      document.getElementById('dropdown-menu').innerHTML = items.join('');
    }
  };
  xhr.send();
}

// eslint-disable-next-line no-unused-vars
function init() {
  const apiKey = obtainAPIKey();
  const monthYear = getMonthYearParameter();
  loadDropdown(apiKey);
  document.getElementById('dropdownMenuButton').innerHTML = monthYear;
  getData(apiKey, monthYear);
  document.getElementById('submit-btn').onclick = function () { addItem(apiKey, monthYear); };
}
