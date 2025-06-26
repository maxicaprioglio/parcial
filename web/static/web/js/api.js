const printer = document.getElementById("printer");

fetch("https://phrasesapi.onrender.com/getAllPhrases")
  .then((res) => res.json())
  .then((data) => {
    const frase = data[Math.floor(Math.random() * data.length)];
    printer.innerHTML = frase.phrase + " — " + frase.author;
  });
