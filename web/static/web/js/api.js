const printer = document.getElementById("printer");

fetch('https://blue-bee-464003.hostingersite.com/frases/random')
  .then(response => response.json())
  .then(data => {
    printer.innerHTML = data.frase + " — " + data.autor;
  })
  .catch(error => {
    console.error('Error al cargar la frase:', error);
  });
