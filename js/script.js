let dataFromApi = []; // stock data from API

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
    manquantDistance : 0,
    totalDistance : 0,
    totalConnu : 0
};

let stats = { // stock stats about each category
    fluide : 0,
    dense : 0,
    saturated : 0,
    blocked : 0,
    manquant : 0
}

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
        console.log("pas de données pour le moment, veuillez retenter votre chance ulterieurement");
    }
}

/*
** Create statistics with our datasets
*/
function createStats(e) {
    e.totalDistance = e.fluideDistance + e.denseDistance + e.saturatedDistance + e.blockedDistance + e.manquantDistance;
    e.totalConnu = e.fluideDistance + e.denseDistance + e.saturatedDistance + e.blockedDistance;
    stats.fluide = Math.trunc((e.fluideDistance / e.totalConnu) * 100);
    stats.dense = Math.trunc((e.denseDistance / e.totalConnu) * 100);
    stats.saturated = Math.trunc((e.saturatedDistance / e.totalConnu) * 100);
    stats.blocked = Math.trunc((e.blockedDistance / e.totalConnu) * 100);
    stats.manquant = Math.trunc((e.manquantDistance / e.totalDistance) * 100);
}


/*
** draw all messages attached to emojis
*/
function drawText() {
    if (dataCount.fluide === 0) {
        document.getElementById("fluide").innerText = "aucune route fluide";
    } else if (dataCount.fluide === 1) {
        document.getElementById("fluide").innerText = "Une seule route fluide";
    } else if (dataCount.fluide > 1) {
        document.getElementById("fluide").innerText = dataCount.fluide + ` routes fluides\n(soit environ ${Math.round(dataCount.fluideDistance / 1000)}km)`;
    }
    if (dataCount.dense === 0) {
        document.getElementById("dense").innerText = "aucune route dense";
    } else if (dataCount.dense === 1) {
        document.getElementById("dense").innerText = "Une seule route dense";
    } else if (dataCount.dense > 1) {
        document.getElementById("dense").innerText = dataCount.dense + ` routes denses\n(soit environ ${Math.round(dataCount.denseDistance / 1000)}km)`;
    }
    if (dataCount.saturated === 0) {
        document.getElementById("sature").innerText = "aucune route saturée";
    } else if (dataCount.saturated === 1) {
        document.getElementById("sature").innerText = "Une seule route saturée";
    } else if (dataCount.saturated > 1) {
        document.getElementById("sature").innerText = dataCount.saturated + ` routes saturées\n(soit environ ${Math.round(dataCount.saturatedDistance / 1000)}km)`;
    }
    if (dataCount.blocked === 0) {
        document.getElementById("bloque").innerText = "aucune route bloquée";
    } else if (dataCount.blocked === 1) {
        document.getElementById("bloque").innerText = "Une seule route bloquée";
    } else if (dataCount.blocked > 1) {
        document.getElementById("bloque").innerText = dataCount.blocked + ` routes bloquées\n(soit environ ${Math.round(dataCount.blockedDistance / 1000)}km)`;
    }
    if (dataCount.manquant === 0) {
        document.getElementById("manquant").innerText = "aucune route sans retour d'information";
    } else if (dataCount.manquant === 1) {
        document.getElementById("manquant").innerText = "Une seule route sans retour d'information";
    } else if (dataCount.manquant > 1) {
        document.getElementById("manquant").innerText = dataCount.manquant + ` routes sans retour d'informations\n(soit environ ${Math.round(dataCount.manquantDistance / 1000)}km)`;
    }
}

/*
** Draw our fantastic graph
*/
function drawGraph() {
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
** Make a text visible on click if it wasn't or the contrary 
*/
function toggleText(elemId) {
    let text = document.getElementById(elemId);
    if (text.style.display === "none") {
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
}

/*
** Link our js and html about clicks during navigation
*/
function listenClicks() {
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
}

/*
** Put our calculated data in our page
*/
function drawData() {
    drawText();
    drawGraph();
    listenClicks();
}

/*
** Main function to manage operations
*/
async function dataHandler() {
    for (let i = 0; i < 844; i += 100) { // API allows 100 lines max per request
        await getData(i);
    }
    createStats(dataCount);
    drawData();
}

dataHandler(); // launch operations
