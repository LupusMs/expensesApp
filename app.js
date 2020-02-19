function getData() {
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://expenses-4c37.restdb.io/rest/february-2020');
xhr.setRequestHeader('x-apikey', apikey);
xhr.responseType = 'json';
xhr.onload = function () {
    if (xhr.status != 200) { 
        alert(`Error ${xhr.status}: ${xhr.statusText}`); 
    } else { 
        var items = [];
        var data = this.response[0];
        for ( const item in data ) {
            if (item != "_id") {
                items.push(item + " : " + data[item] + " ");
            }
        }
        document.getElementById("test").innerHTML = items.join("");
    }
};
xhr.send();  
}
  
