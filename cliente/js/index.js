const API_URL = "http://192.168.8.244:3030/";

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

function addPage() {
  const memory = document.getElementById("name").value;
  //console.log(memory);

  const url = `${API_URL}insertPage?name=${memory}`;
  ajaxGet(url, resp => {
    const res = JSON.parse(resp);
    console.log(res);
  });
  const baseNode = document.getElementById("paginas");
  while (baseNode.hasChildNodes()) baseNode.removeChild(baseNode.firstChild);
}

function changeState(id, status) {
  const url = `${API_URL}changestatus?id=${id}`;
  ajaxGet(url, resp => {
    const res = JSON.parse(resp);
    console.log(true);
    //ListarPages(status);
  });
  ListarPages(status);
}
function ListarPages(opcion) {
  //console.log(opcion);
  const url = `${API_URL}listPages`;
  const baseNode = document.getElementById("paginas");
  while (baseNode.hasChildNodes()) baseNode.removeChild(baseNode.firstChild);
  ajaxGet(url, resp => {
    const listPages = JSON.parse(resp);
    for (let i = 0; i < listPages.length; i++) {
      if (listPages[i].status == opcion) {
        const id = listPages[i].id;
        const name = listPages[i].name;
        const newNode = `
        <tr>
            <td>${id} </td>
            <td>${name}</td>
            <td><a class="waves-effect waves-light btn-small" href="#" onclick="changeState(${id},${opcion})">Change</a></td>
          </tr>`;
        baseNode.insertAdjacentHTML("beforeend", newNode);
      }
    }
  });
}
