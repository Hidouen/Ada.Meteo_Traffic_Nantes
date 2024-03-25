// let colorsCount = {
//     manquant : 0,
//     fluide : 0,
//     dense : 0,
//     saturated : 0,
//     blocked : 0
// };
// const ulElement = document.querySelector("ul");

// let toutesLesDonnees = offset => {
//     return fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_fluidite-axes-routiers-nantes-metropole/records?offset=${offset}&limit=100`)
//     .then(response => response.json())
//     .then((records) => {
//         console.log(records)
//         for (const record of records.results) {
//             const liElement = document.createElement("li")
//             liElement.innerText = record.couleur_tp
//             if (parseInt(record.couleur_tp) < 3) {
//                 colorsCount.manquant++;
//             }
//             else if (parseInt(record.couleur_tp) === 3) {
//                 colorsCount.fluide++;
//             }
//             else if (parseInt(record.couleur_tp) === 4) {
//                 colorsCount.dense++;
//             }
//             else if (parseInt(record.couleur_tp) === 5) {
//                 colorsCount.saturated++;
//             }
//             else {
//                 colorsCount.blocked++;
//             }
//             ulElement.appendChild(liElement)
//             }
//     })
//     .catch(error => console.log(error))
// }
// for (let i = 0; i < 844; i += 100) {
//     toutesLesDonnees(i)
// }
// console.log(toutesLesDonnees);
// console.log(colorsCount);

// document.getElementById("manquant").innerText = colorsCount.manquant;
// document.getElementById("fluide").innerText = colorsCount.fluide;
// document.getElementById("dense").innerText = colorsCount.dense;
// document.getElementById("sature").innerText = colorsCount.saturated;
// document.getElementById("bloque").innerText = colorsCount.blocked;

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
    console.log(dataFromApi);
    console.log(colorsCount);
    document.getElementById("manquant").innerText = colorsCount.manquant;
    document.getElementById("fluide").innerText = colorsCount.fluide;
    document.getElementById("dense").innerText = colorsCount.dense;
    document.getElementById("sature").innerText = colorsCount.saturated;
    document.getElementById("bloque").innerText = colorsCount.blocked;
}

callData();
// console.log(typeof dataFromApi);


// let toutesLesDonnees = offset => {
//     return fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_fluidite-axes-routiers-nantes-metropole/records?offset=${offset}&limit=100`)
//     .then(response => response.json())
//     .then((records) => {
//         console.log(records)
//         for (const record of records.results) {
//             const liElement = document.createElement("li")
//             liElement.innerText = record.couleur_tp
//             if (parseInt(record.couleur_tp) < 3) {
//                 colorsCount.manquant++;
//             }
//             else if (parseInt(record.couleur_tp) === 3) {
//                 colorsCount.fluide++;
//             }
//             else if (parseInt(record.couleur_tp) === 4) {
//                 colorsCount.dense++;
//             }
//             else if (parseInt(record.couleur_tp) === 5) {
//                 colorsCount.saturated++;
//             }
//             else {
//                 colorsCount.blocked++;
//             }
//             ulElement.appendChild(liElement)
//             }
//     })
//     .catch(error => console.log(error))
// }
// for (let i = 0; i < 844; i += 100) {
//     toutesLesDonnees(i)
// }
// console.log(toutesLesDonnees);
// console.log(colorsCount);

// document.getElementById("manquant").innerText = colorsCount.manquant;
// document.getElementById("fluide").innerText = colorsCount.fluide;
// document.getElementById("dense").innerText = colorsCount.dense;
// document.getElementById("sature").innerText = colorsCount.saturated;
// document.getElementById("bloque").innerText = colorsCount.blocked;