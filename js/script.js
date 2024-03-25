let colorsCount = {
    manquant : 0,
    fluide : 0,
    dense : 0,
    saturated : 0,
    blocked : 0
};

let dataFromApi = [];

async function getData(count) {
    try {
        const res = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_fluidite-axes-routiers-nantes-metropole/records?offset=${count}&limit=100`);
        const data = await res.json();
        dataFromApi.push(data.results);
        for (const record of data.results) {
            if (parseInt(record.couleur_tp) < 3) {
                colorsCount.manquant++;
            }
            else if (parseInt(record.couleur_tp) === 3) {
                colorsCount.fluide++;
            }
            else if (parseInt(record.couleur_tp) === 4) {
                colorsCount.dense++;
            }
            else if (parseInt(record.couleur_tp) === 5) {
                colorsCount.saturated++;
            }
            else {
                colorsCount.blocked++;
            }
        }
    } catch (error) {
        console.log("pas de donnees pour le moment");
    }
}

async function callData() {
    for (let i = 0; i < 844; i += 100) {
        await getData(i);
    }
    if (colorsCount.manquant > 0) {
        document.getElementById("manquant").innerText = colorsCount.manquant + " troncon(s) sans retour d'informations";
    }
    if (colorsCount.fluide > 0) {
        document.getElementById("fluide").innerText = colorsCount.fluide + " troncon(s) fluide(s)";
    }
    if (colorsCount.dense > 0) {
        document.getElementById("dense").innerText = colorsCount.dense + " troncon(s) dense(s)";
    }
    if (colorsCount.saturated > 0) {
        document.getElementById("sature").innerText = colorsCount.saturated + " troncon(s) sature(s)";
    }
    if (colorsCount.blocked > 0) {
        document.getElementById("bloque").innerText = colorsCount.blocked + " troncon(s) bloque(s)";
    }
}

callData();