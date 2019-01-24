const API_URL = "http://localhost:6060/";

function ajaxGet(url, callback) {
  // Creación de la petición HTTP
  var req = new XMLHttpRequest();
  // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
  req.open("GET", url, true);
  // Gestor del evento que indica el final de la petición (la respuesta se ha recibido)
  req.addEventListener("load", function() {
    // La petición ha tenido éxito
    if (req.status >= 200 && req.status < 400) {
      callback(req.responseText);
    } else {
      // Se muestran informaciones sobre el problema ocasionado durante el tratamiento de la petición
      console.error(req.status + " " + req.statusText);
    }
  });
  // Gestor del evento que indica que la petición no ha podido llegar al servidor
  req.addEventListener("error", function() {
    console.error("Error de red"); // Error de conexión
  });
  // Envío de la petición
  req.send(null);
}

function ajaxPost(url, data, callback) {
  // Creación de la petición HTTP
  var fd = new FormData();
  fd.append("file", data);
  var req = new XMLHttpRequest();
  // Petición HTTP GET asíncrona si el tercer parámetro es "true" o no se especifica
  req.open("POST", url);
  req.onreadystatechange = function() {
    //Call a function when the state changes.
    if (req.readyState == 4 && req.status == 200) {
      callback(req.responseText);
    }
  };
  // console.log(fd);
  req.send(fd);
}

function execute(url) {
  if (document.getElementById("file").files !== undefined) {
    const name = document.getElementById("file").files[0].name;
    const toUrl = `${url}?name=${name}`;
    ajaxGet(toUrl, resp => {
      const res = JSON.parse(resp);
      const baseNode = document.getElementById(`out-${url}`);
      while (baseNode.hasChildNodes())
        baseNode.removeChild(baseNode.firstChild);
      const newNode = `<h4 class="center-align">${res.out}</h4>`;
      baseNode.insertAdjacentHTML("beforeend", newNode);
      console.log(res);
    });
  }
}
function getContent() {
  const url = `${API_URL}page?number=0`;
  let text = document.getElementById(`principal-input`);
  ajaxGet(url, resp => {
    const res = JSON.parse(resp);
    text.value = res.content;
    console.log(text.value);
  });
}

function action() {
  let host = document.getElementById("host").value;
  host = host == "localhost" ? "127.0.0.1" : host;
  const port = document.getElementById("port").value;
  const name = document.getElementById("name").value;
  const memory = document.getElementById("memory").value;
  const cpu = document.getElementById("cpu").value;
  const url = `${API_URL}add?host=${host}&port=${port}&name=${name}&memory=${memory}&cpu=${cpu}`;
  ajaxGet(url, resp => {
    const res = JSON.parse(resp);
    console.log(res.msg);
  });
}

function saveFile(url) {
  const data = document.getElementById("file").files[0];
  ajaxPost(url, data, res => {
    console.log(res);
  });
}

function renderServers() {
  const memory = document.getElementById("memory").value;
  const cpu = document.getElementById("cpu").value;
  const url = `${API_URL}servers?memory=${memory}&cpu=${cpu}`;
  if (cpu !== undefined && memory !== undefined) {
    const baseNode = document.getElementById("servers");
    while (baseNode.hasChildNodes()) baseNode.removeChild(baseNode.firstChild);
    ajaxGet(url, resp => {
      console.log(resp);
      var serverList = JSON.parse(resp);
      for (let i = 0; i < serverList.length; i++) {
        const host = serverList[i].host;
        const name = serverList[i].name;
        const port = serverList[i].port;
        const memory = serverList[i].memory;
        const cpu = serverList[i].cpu;
        const url = "http://" + host + ":" + port;
        const newNode = `
        <div class="col s2"></div>
        <div class="col s8">
          <h4 class="center-align">${name}</h4>
          <span>La direccion del servidor es ${url}</span>
          <span>Recursos : Memoria (${memory}) | CPU (${cpu})</span>
          <form action="#">
            <div class="row file-field input-field">
              <div class="btn">
                <span>File</span> <input id="file" type="file" multiple />
              </div>
              <div class="file-path-wrapper">
                <input
                  class="file-path validate"
                  type="text"
                  placeholder="Upload one or more files"
                />
              </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                  <div class="col s6">
                    <a
                      class="waves-effect waves-light btn col"
                      onclick="execute('${url}/exec-cpp')"
                      href="#"
                    >
                      <i class="material-icons left">play_arrow</i>Ejecutar
                    </a>
                  </div>
                  <div class="col s6">
                    <a
                      class="waves-effect waves-light btn col"
                      onclick="saveFile('${url}/upload')"
                      href="#"
                    >
                      <i class="material-icons left">backup</i>Enviar
                    </a>
                  </div>
                </div>
            </div>
            <div class="row" id="out-${url}/exec-cpp">
            </div>
          </form>
        </div>`;
        baseNode.insertAdjacentHTML("beforeend", newNode);
      }
    });
  }
}
