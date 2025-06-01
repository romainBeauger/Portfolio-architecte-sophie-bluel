//#region NAV

// const navLinks = document.querySelectorAll('.navLink');

// navLinks.forEach(link => { 

//     link.addEventListener('click', e => {

//         navLinks.forEach(l => l.classList.remove('active'));

//         e.currentTarget.classList.add('active');      
//     })
// })

//#endregion


//#region Récupérer les travaux depuis l'API 

// Utilisation de la gallery si présente 
const galleryTravaux = document.querySelector('.gallery');

async function recupererTravaux(categoryId = null) {  

  console.log("Appel de recupererTravaux avec catégorie :", categoryId);
        
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
const divBoutonModifier = document.querySelector('.boutonModifier');
const afficheBtnFiltrage = document.querySelector('.btn-filtrage');
const navLinkProjetsLogin = document.querySelector('#navLinkProjetsLogin');
const navLinkContactLogin = document.querySelector('#navLinkContactLogin');
let isLoggedIn = !!localStorage.getItem('token'); // double inversion renvoi true si token présent et false si non présent

// Au premier chargement de la page
document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  const loginBtn = document.querySelector('.openModal');

  if (token) {
    // Utilisateur connecté : on montre "Logout" et on masque les filtres
    loginBtn.textContent = "Logout";
    afficheBtnFiltrage.style.display = "none";
  } else {
    // Utilisateur non connecté : on montre "Login" on affiche les filtres et bouton tous avec class active pour le fond vert
    loginBtn.textContent = "Login";
    afficheBtnFiltrage.style.display = "flex";
    divBoutonModifier.style.display = "none";
    activerBouton(TousLesBoutonsFiltre, btnFiltreTous);
  }

  // Gestion du clic sur login/logout
  loginBtn.addEventListener("click", (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (token) {
    // Déconnexion
    localStorage.removeItem("token");
    isLoggedIn = false;
    loginBtn.textContent = "Login";
    afficheBtnFiltrage.style.display = "flex";
    // Réaffiche individuellement tous les boutons de filtre
    TousLesBoutonsFiltre.forEach(element => {
      element.style.display = 'inline-block';
    });
    divBoutonModifier.style.display = "none";
    activerBouton(TousLesBoutonsFiltre, btnFiltreTous);
    recupererTravaux();
  } else {
    // Affichage modale login
    modal.style.display = "block";
    loginModal.style.fontWeight = "bold";
  }
  });
});

// Click sur Projets dans la modale Login
navLinkProjetsLogin .addEventListener('click', () => {
  // On ferme la modale au click pour permettre d'aller sur l'ancre Mes Projets
    modal.style.display = 'none';
});

// Click sur Projets dans la modale Login
navLinkContactLogin .addEventListener('click', () => {
  // On ferme la modale au click pour permettre d'aller sur l'ancre Contact
    modal.style.display = 'none';
});


// Fermer la modale login admin
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fermer la modale login admin si on click à l'extérieur
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


//#region Modale Suppression de travaux

const divBtnModifierTravaux = document.querySelector('.boutonModifier');
const adminGallery = document.querySelector('#adminGallery');
const modalTravaux = document.querySelector('#modalTravaux');
const closeModalTravaux = document.querySelector('.closeModalTravaux');

async function afficherTravauxAdmin() {
  const response = await fetch("http://localhost:5678/api/works");
  const travaux = await response.json();

  adminGallery.innerHTML = '';

  travaux.forEach(travail => {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = travail.imageUrl;

    // Création de l'icône corbeille
    const deleteBtn = document.createElement('i');
    //Ajout classe font awesome
    deleteBtn.classList.add('fa-solid', 'fa-trash-can', 'delete-icon');

    // Ajout du listener au moment de la création

    deleteBtn.addEventListener('click', async () => {
      const confirmation = confirm("Voulez-vous vraiment supprimer ce travail ?");
      if (!confirmation) return;

      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`http://localhost:5678/api/works/${travail.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          // Supprimer visuellement la figure de la galerie
          figure.remove();
        } else {
          alert("Échec de la suppression.");
        }
      } catch (error) {
        console.error("Erreur suppression :", error);
      }
    });

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    adminGallery.appendChild(figure);
  });
}

// Affiche la modale travaux quand on click sur le bouton modifier
divBtnModifierTravaux.addEventListener('click', () => {
    document.querySelector('#modalTravaux').style.display = 'block';
    afficherTravauxAdmin();
});

// Fermer la modale travaux quand on click en dehors
window.addEventListener('click', (event) => {
  if (event.target === modalTravaux) {
    modalTravaux.style.display = 'none';
    
    // Si on ferme la modale en cliquant dans l'overlay on relance la recupération de travaux
    recupererTravaux();
  }

});

// Fermer la modale suppresion travaux quand on click sur la croix
closeModalTravaux.addEventListener('click', () => {
  modalTravaux.style.display = 'none';

  // Si on ferme la modale avec la croix on relance la recupération de travaux
  recupererTravaux();
});


//#endregion


//#region Modale Ajout de Travaux

const ajoutPhotoBtn = document.querySelector('.addPhotoBtn');
const closeModalAjoutTravaux = document.querySelector('.closeModalAjoutTravaux');
const LeftArrowModalAjoutTravaux = document.querySelector('.LeftArrowModalAjoutTravaux');
const divModalAjoutTravaux = document.querySelector('.modalAjoutTravaux');
const inputFile = document.getElementById('photoFile');
const inputTextPhoto = document.getElementById('photoTitle');
const previewImage = document.getElementById('imagePreview');
const formAjout = document.getElementById('formAjoutTravail');
const logoImage = document.querySelector('#logoImage');
const resetImageBtn = document.getElementById("resetImageBtn");
const divAddPhotoBtnAjoutTravaux = document.querySelector('.addPhotoBtnAjoutTravaux');
const textAjoutPhoto = document.querySelector('#textAjoutPhoto');

async function chargerCategories() {
  const select = document.getElementById("photoCategory");

  // On vide complètement les catégories et le champ titre 
  select.innerHTML = "";
  inputTextPhoto.value = "";

  // On ajoute l'option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Choisir une catégorie --";
  select.appendChild(defaultOption);

  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des catégories");
    }

    const categories = await response.json();

    categories.forEach(categorie => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur dans chargerCategories :", error);
    alert("Impossible de charger les catégories.");
  }
}




ajoutPhotoBtn.addEventListener('click', () => {
    modalTravaux.style.display = 'none';
    divModalAjoutTravaux.style.display = 'block';
    // On supprime aussi le preview image au cas ou on fasse retour arriere avec une image déjà chargée précédemment
    previewImage.style.display = 'none';
    // On affiche le logo image, le bouton et le texte quand la photo est chargée
      logoImage.style.display = 'flex';
      divAddPhotoBtnAjoutTravaux.style.display = 'flex';
      textAjoutPhoto.style.display = 'flex';

    chargerCategories();
});

closeModalAjoutTravaux.addEventListener('click', () => {
    divModalAjoutTravaux.style.display = 'none';
    modalTravaux.style.display = 'none';
});

// Si on click sur la flèche arriere on revient sur la modale suppresion travaux
LeftArrowModalAjoutTravaux.addEventListener('click', () => {
    divModalAjoutTravaux.style.display = 'none';
    modalTravaux.style.display = 'block';
});

// Fermer la modale ajout travaux quand on click en dehors
window.addEventListener('click', (event) => {
  if (event.target === divModalAjoutTravaux) {
    divModalAjoutTravaux.style.display = 'none';
  }
});

inputFile.addEventListener('change', () => {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewImage.style.display = 'block';
      resetImageBtn.style.display = 'block';
      // On masque le logo image, le bouton et le texte quand la photo est chargée
      logoImage.style.display = 'none';
      divAddPhotoBtnAjoutTravaux.style.display = 'none';
      textAjoutPhoto.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

resetImageBtn.addEventListener('click', () => {
  // Réinitialise le champ file
  inputFile.value = "";

  // Masque la preview et réaffiche l’icône
  previewImage.src = "";
  previewImage.style.display = 'none';
  resetImageBtn.style.display = 'none';
  // On affiche le logo image, le bouton et le texte quand la photo est chargée
  logoImage.style.display = 'flex';
  divAddPhotoBtnAjoutTravaux.style.display = 'flex';
  textAjoutPhoto.style.display = 'flex';

  // On reset l'input et les catégories
  chargerCategories();

});

formAjout.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = inputFile.files[0];
  const title = document.getElementById('photoTitle').value;
  const category = document.getElementById('photoCategory').value;

  if (!file || !title || !category) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('category', category);

  const token = localStorage.getItem('token');

  try {
    const res = await fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      alert("Travail ajouté !");
      formAjout.reset();
      previewImage.src = "";
      previewImage.style.display = 'none';
      divModalAjoutTravaux.style.display = 'none';
      modalTravaux.style.display = 'block';




      afficherTravauxAdmin(); // pour actualiser
    } else {
      alert("Erreur lors de l'ajout");
    }
  } catch (err) {
    console.error("Erreur:", err);
    alert("Une erreur est survenue");
  }
});


//#endregion