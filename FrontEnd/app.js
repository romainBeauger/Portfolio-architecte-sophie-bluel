//#region NAV

const navLinks = document.querySelectorAll('.navLink');

navLinks.forEach(link => { 

    link.addEventListener('click', e => {

        navLinks.forEach(l => l.classList.remove('active'));

        e.currentTarget.classList.add('active');      
    })
})

//#endregion


//#region Récupérer les travaux depuis l'API 

async function recupererTravaux(categoryId = null) {  
        
    const requete = await fetch("http://localhost:5678/api/works");
    const reponse = await requete.json();  
    
     // On récupère la div gallery
    const galleryTravaux = document.querySelector('.gallery');

    // On vide la gallery
    galleryTravaux.innerHTML = "";

    // Si on a un identifiant en argument (categoryId) on filtre reponse sinon on ne filtre rien et on affiche tout
    const filteredWorks = categoryId !== null ? reponse.filter( (e) => e.categoryId === categoryId) : reponse;  
    
    // On fait une boucle for of pour itérer sur filteredWorks
    for (const work of filteredWorks) {        

        // On créé les éléments nécessaires
        const baliseFigure = document.createElement('figure');
        const baliseImg = document.createElement('img');
        const baliseFigcaption = document.createElement('figcaption');

        // On indique la src et le texte depuis l'API
        baliseImg.src = work.imageUrl; 
        baliseFigcaption.textContent = work.title; 

        // On insère la balise img et figcaption à la balise figure
        baliseFigure.appendChild(baliseImg);
        baliseFigure.appendChild(baliseFigcaption);

        // On insère la balise figure à la div gallery
        galleryTravaux.appendChild(baliseFigure);
    }
}
//#endregion


//#region Filtres

// Utilisation de la gallery si présente 
const galleryTravaux = document.querySelector('.gallery');
// Récupération des boutons de filtrage
const btnFiltreTous = document.querySelector('#btnFiltreTous');
const btnFiltreObjets = document.querySelector('#btnFiltreObjets');
const btnFiltreAppartements = document.querySelector('#btnFiltreAppartements');
const btnFiltreHotelsRestaurants = document.querySelector('#btnFiltreHotelsRestaurants');
const TousLesBoutonsFiltre = document.querySelectorAll('.btnFiltre');

if(galleryTravaux){
    
    recupererTravaux();

    // GESTION DES FILTRES

    

    // Fonction permettant d'enlever puis remettre la classe active aux boutons de notre choix

    function activerBouton(listBtn, btnActif) {
        listBtn.forEach( btn => btn.classList.remove('active'));
        btnActif.classList.add('active');
    }

    // Bouton filtre Tous 
    btnFiltreTous.addEventListener('click', () => {
        activerBouton(TousLesBoutonsFiltre, btnFiltreTous);
        recupererTravaux();
    });

    // Bouton filtre Objets
    btnFiltreObjets.addEventListener('click', () => {
        activerBouton(TousLesBoutonsFiltre, btnFiltreObjets);
        recupererTravaux(1);    
    });

    // Bouton filtre Appartements
    btnFiltreAppartements.addEventListener('click', () => {
        activerBouton(TousLesBoutonsFiltre, btnFiltreAppartements);
        recupererTravaux(2);
    });

    // Bouton filtre Hotels & Restaurants
    btnFiltreHotelsRestaurants.addEventListener('click', () => {
        activerBouton(TousLesBoutonsFiltre, btnFiltreHotelsRestaurants);
        recupererTravaux(3);
    });
}


//#endregion


//#region Modale Login

const modal = document.querySelector('#modal');
const openBtn = document.querySelector('.openModal');
const closeBtn = document.querySelector('.closeModal');
const submitModalBtn = document.querySelector('#submitModalBtn');
const loginModal = document.querySelector('.loginModal');
let isLoggedIn = !!localStorage.getItem('token'); // double inversion renvoi true si token présent et false si non présent
const divBoutonModifier = document.querySelector('.boutonModifier');

// Met à jour le texte du bouton Login / Logout en fonction de isLoggedIn
openBtn.textContent = isLoggedIn ? 'Logout' : 'Login';

// Le bouton Modifier ne doit pas apparaitre au premier chargement
// La div contenant le bouton modifier doit disparaitre
        divBoutonModifier.style.display = 'none';

// Ouvrir la modale
openBtn.addEventListener('click', () => {  

    if(isLoggedIn){
        // On veut se déconnecter car on clique sur Logout

        // On supprimer le token du localStorage
        localStorage.removeItem('token');
        // Plus loggé donc isLoggedIn = false
        isLoggedIn = false;
        // On réécrit login sur le lien
        openBtn.textContent = 'Login';
         // Les boutons de filtres doivent être visible
        TousLesBoutonsFiltre.forEach(element => {
            element.style.display = 'block';
        }); 
        // La div contenant le bouton modifier doit disparaitre
        divBoutonModifier.style.display = 'none';

        console.log(`Déconnecté avec succès`);        
    } else {
        modal.style.display = 'block';
        loginModal.style.fontWeight = 'bold';
    }
});

// Fermer la modale
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fermer la modale si on click à l'extérieur
window.addEventListener('click', (event) => {
    if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Bouton Submit 
submitModalBtn.addEventListener('click', (event) => {

    event.preventDefault(); 

    const url = "http://localhost:5678/api/users/login";
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: username, password: password })
    })
    .then(response => {

        if( ! response.ok){
            throw new Error('Echec de la connexion')
        }      
        return response.json()        
    })
    .then(data => {
        // Traiter la réponse

        // Stocker le Token dans le local Storage
        localStorage.setItem('token', data.token);
        isLoggedIn = true;
        openBtn.textContent = 'Logout';
        
        // Fermer la modale 
        modal.style.display = 'none';
        
        // Les boutons de filtres doivent disparaitre
        TousLesBoutonsFiltre.forEach(element => {
            element.style.display = 'none';
        });

        // On doit faire apparaitre le logo modifier et le texte
        divBoutonModifier.style.display = 'inline';


        console.log(`Connecté avec succès`);  
    })  
    .catch(error =>{
        console.error('Erreur : ', error);
        alert("Identifiants incorrects ou erreur serveur");
    })
});

//#endregion


