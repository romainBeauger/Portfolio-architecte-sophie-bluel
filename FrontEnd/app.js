//#region Récupérer les travaux depuis l'API 


async function recupererTravaux(categorieFiltre = null) {  
    
    const requete = await fetch("http://localhost:5678/api/works");
    const reponse = await requete.json(); 
    
    // On récupère la div gallery
    const galleryTravaux = document.querySelector('.gallery');
    // On vide la gallery
    galleryTravaux.innerHTML = ``;

    // Si on a un identifiant en argument (categorieFiltre) on filtre reponse sinon on ne filtre rien et on affiche tout
    const travauxFiltres = categorieFiltre !== null ? reponse.filter( (e) => e.categoryId === categorieFiltre) : reponse;  

    for (let filtre of travauxFiltres) {

        // On créé les éléments nécessaires
        const baliseFigure = document.createElement('figure');
        const baliseImg = document.createElement('img');
        const baliseFigcaption = document.createElement('figcaption');

        // On indique la src et le texte depuis l'API
        baliseImg.src = filtre.imageUrl; 
        baliseFigcaption.textContent = filtre.title; 

        // On insère la balise img et figcaption à la balise figure
        baliseFigure.appendChild(baliseImg);
        baliseFigure.appendChild(baliseFigcaption);

        // On insère la balise figure à la div gallery
        galleryTravaux.appendChild(baliseFigure);
    }
}

recupererTravaux();

//#endregion



//#region FILTRAGE

// Récupération des boutons de filtrage
const btnFiltreTous = document.querySelector('#btnFiltreTous');
const btnFiltreObjets = document.querySelector('#btnFiltreObjets');
const btnFiltreAppartements = document.querySelector('#btnFiltreAppartements');
const btnFiltreHotelsRestaurants = document.querySelector('#btnFiltreHotelsRestaurants');

// Listeners 
btnFiltreTous.addEventListener('click', async (event) => {
    recupererTravaux();   
});

// Filtre Objets
btnFiltreObjets.addEventListener('click', async (event) => {
    recupererTravaux(1);    
});

btnFiltreAppartements.addEventListener('click', async (event) => {
    recupererTravaux(2);
});

btnFiltreHotelsRestaurants.addEventListener('click', async (event) => {
    recupererTravaux(3);
});

//#endregion
