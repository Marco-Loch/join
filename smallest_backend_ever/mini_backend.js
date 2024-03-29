// @ts-check

let jsonFromServer = {};
let BASE_SERVER_URL =
  "https://marco-loch.developerakademie.net/join/smallest_backend_ever";

const backend = {
  setItem: function (key, item) {
    jsonFromServer[key] = item;
    return saveJSONToServer();
  },
  getItem: function (key) {
    if (!jsonFromServer[key]) {
      return null;
    }
    return jsonFromServer[key];
  },
  deleteItem: function (key) {
    delete jsonFromServer[key];
    return saveJSONToServer();
  },
};

async function downloadFromServer() {
  try {
    let response = await loadJSONFromServer();
    console.log('Server response:', response);
    jsonFromServer = response; // response ist bereits ein JSON-Objekt
  } catch (error) {
    console.error("Error downloading data from server:", error);
  }
}

/**
 * Loads a JSON or JSON Array to the Server
 * payload {JSON | Array} - The payload you want to store
 */
async function loadJSONFromServer() {
  let response = await fetch(
    BASE_SERVER_URL + "/nocors.php?json=database&noache=" + new Date().getTime()
  );
  return await response.text();
}

function loadJSONFromServerOld() {
  return new Promise(function (resolve, reject) {
    let xhttp = new XMLHttpRequest();
    let proxy = determineProxySettings();
    let serverURL =
      proxy +
      BASE_SERVER_URL +
      "/nocors.php?json=database&noache=" +
      new Date().getTime();

    xhttp.open("GET", serverURL);

    xhttp.onreadystatechange = function (oEvent) {
      if (xhttp.readyState === 4) {
        if (xhttp.status >= 200 && xhttp.status <= 399) {
          resolve(xhttp.responseText);
        } else {
          reject(xhttp.statusText);
        }
      }
    };

    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  });
}

/**
 * Saves a JSON or JSON Array to the Server
 */
function saveJSONToServer() {
  return new Promise(function (resolve, reject) {
    let xhttp = new XMLHttpRequest();
    let proxy = determineProxySettings();
    let serverURL = proxy + BASE_SERVER_URL + "/save_json.php";
    xhttp.open("POST", serverURL);

    xhttp.onreadystatechange = function (oEvent) {
      if (xhttp.readyState === 4) {
        if (xhttp.status >= 200 && xhttp.status <= 399) {
          resolve(xhttp.responseText);
        } else {
          reject(xhttp.statusText);
        }
      }
    };

    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(jsonFromServer));
  });
}

function determineProxySettings() {
  if (window.location.href.indexOf(".developerakademie.com") > -1) {
    return "";
  } else {
    return "https://cors-anywhere.herokuapp.com/";
  }
}
