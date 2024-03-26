let dataCount = { // stock data from our calculations
    fluide : 0,
    dense : 0,
    saturated : 0,
    blocked : 0,
    manquant : 0,
    fluideDistance : 0,
    denseDistance : 0,
    saturatedDistance : 0,
    blockedDistance : 0,
    manquantDistance : 0
};

let dataFromApi = []; // stock data from API

/*
** GET data from API and calculate
*/
async function getData(count) {
    try {
        const res = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_fluidite-axes-routiers-nantes-metropole/records?offset=${count}&limit=100`);
        const data = await res.json();
        dataFromApi.push(data.results);
        for (const record of data.results) {
            if (parseInt(record.couleur_tp) < 3) {
                dataCount.manquant++;
                dataCount.manquantDistance += record.cha_long;
            }
            else if (parseInt(record.couleur_tp) === 3) {
                dataCount.fluide++;
                dataCount.fluideDistance += record.cha_long;
            }
            else if (parseInt(record.couleur_tp) === 4) {
                dataCount.dense++;
                dataCount.denseDistance += record.cha_long;
            }
            else if (parseInt(record.couleur_tp) === 5) {
                dataCount.saturated++;
                dataCount.saturatedDistance += record.cha_long;
            }
            else {
                dataCount.blocked++;
                dataCount.blockedDistance += record.cha_long;
            }
        }
    } catch (error) {
        console.log("pas de donnees pour le moment");
    }
}

/*
** Put our calculated data in HTML
*/
function drawData() {
    if (dataCount.fluide > 0) {
        document.getElementById("fluide").innerText = dataCount.fluide + " routes fluide(s)";
    }
    if (dataCount.dense > 0) {
        document.getElementById("dense").innerText = dataCount.dense + " route(s) dense(s)";
    }
    if (dataCount.saturated > 0) {
        document.getElementById("sature").innerText = dataCount.saturated + " route(s) sature(s)";
    }
    if (dataCount.blocked > 0) {
        document.getElementById("bloque").innerText = dataCount.blocked + " route(s) bloque(s)";
    }
    if (dataCount.manquant > 0) {
        document.getElementById("manquant").innerText = dataCount.manquant + " routes sans retour d'informations";
    }
    
    const pieCanvas = document.getElementById("pieCanvas")

    const pieChart = new Chart (pieCanvas, {
    type: "pie",
    data: {
        labels: ["Fluide", "Dense", "Saturé", "Bloqué", "Indéfini"],
        datasets: [{
            data: [dataCount.fluideDistance, dataCount.denseDistance, dataCount.saturatedDistance, dataCount.blockedDistance, dataCount.manquantDistance],
            backgroundColor: ["rgb(85, 235, 98)", "yellow", "orange", "red", "grey"]
            }]
        }
    })
}

/*
** Main function to manage operations
*/
async function manageData() {
    for (let i = 0; i < 844; i += 100) { // API allows 100 lines max per request
        await getData(i);
    }
    drawData();
}

manageData(); // launch operations

// let trou;

function toggleText(elemId) {
    var text = document.getElementById(elemId);
    if (text.style.display === "none") {
      text.style.display = "block";
    //   trou = document.getElementById("car");
    //   trou.style.opacity = 0.50;
    } else {
      text.style.display = "none";
    }
  }

  document.getElementById("smileyFluide").addEventListener("click", function() {
    toggleText("fluide")
  });
  document.getElementById("smileyDense").addEventListener("click", function() {
    toggleText("dense")
  });
  document.getElementById("smileySature").addEventListener("click", function() {
    toggleText("sature")
  });
  document.getElementById("smileyBloque").addEventListener("click", function() {
    toggleText("bloque")
  });
  document.getElementById("smileyManquant").addEventListener("click", function() {
    toggleText("manquant")
  });