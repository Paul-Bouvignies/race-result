// variables des localstorage
var storage = JSON.parse(localStorage.getItem("race_result")) || [];
var storageRace = JSON.parse(localStorage.getItem("race_name")) || [];
// variable de ciblage des input -> popup ajout player 
var userName = document.getElementById("name");
var lt1 = document.getElementById("lt1");
var lt2 = document.getElementById("lt2");
var lt3 = document.getElementById("lt3");

  //variable de regex
  var regex = /^([0-999:]){5,9}$/ ;

  // nombre de valeurs comprise entre 3 et 7
  //
  //
  //
  //


//objet du fichier listOfRace
const ListOfCircuit = Object.values(circuit);

//style de log dans la console
const styles = `
background-color : orange ;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,  'Open Sans', 'Helvetica Neue', sans-serif; 
color:black;
`;

//premier noyaux -> qui lis sur des résultats sont présents
// oui = appel de la fonction createList()
// non = appel de la fonction openPopupPlayer() pour ajout du premier player
if (!window.localStorage.getItem("race_result") || !window.localStorage.getItem("race_name")) {
  //appel de la fonction de selection du circuit
  openPopupRace();
  //appel de la fonction de création du header
} else {
    //affichage de toutes les sections
    document.getElementById("title").style.display = "flex";
    document.getElementById("result").style.display = "block";
    document.getElementById("add").style.display = "block";
    //appel de la fonction de création de la liste des resultat
    createList();
    // appel de la fonction de création du header
    createHeader();

}

// appel de la fonction de création de la liste des circuits
createSelect();

// ouverture du de la PopupPlayer pour ajout de player
document.getElementById("addItem").addEventListener("click", openPopupPlayer);

// fermeture du de la PopupPlayer pour ajout de player
document.getElementById("cross").addEventListener("click", closePopupPlayer);

// gestion du formulaire de choix de la course
document.getElementById("formRace").addEventListener("submit" , (e)=> {
  e.preventDefault();

  // appel de la fonction de création du header
  createHeader();
  //appel de la fonction de fermeture de PopupRace
  closePopupRace()

  //affichage de toutes les sections
  document.getElementById("title").style.display = "flex";
  document.getElementById("result").style.display = "block";
  document.getElementById("add").style.display = "block";

  // après le temps de l'animation -> appel de la fonction d'ouverture de la PopupPlayer
  setTimeout(() => {
    openPopupPlayer()
  }, 150);
  //appel de la fonction de fermeture de PopupRace
  closePopupRace()
})

// fonction de création du header
function createHeader(){

  // ajout dans le header du nom du circuit, du drapeau etc

  document.getElementById("headerCircuit").setAttribute("src" , storageRace[0]);
  document.getElementById("headerName").innerHTML = storageRace[1];
  document.getElementById("headerFlag").setAttribute("src" ,storageRace[2] );
  document.getElementById("headerHastag").innerHTML = storageRace[3];
}

// lecture du fichier listOfCircuit et création de la liste
function createSelect(){

  // création de la liste de selction de la course selon le fichier ListOfRace

  var listOfSuggestions = document.getElementById("suggestions");
  listOfSuggestions.innerHTML =""
  
  document.getElementById("search").setAttribute("placeholder" , "search among the "+ListOfCircuit.length+" circuits")
  for (let index = 0; index < ListOfCircuit.length; index++) {
      listOfSuggestions.innerHTML += 
      `
      <li id="race`+index+`" onmouseover="displayInfo(`+index+`)" onclick="select(`+index+`)"><a href="javascript:void(0)">`+ListOfCircuit[index][1]+`</a></li>
      `
      
  }
}

// fonction de recherche du circuit dans la liste
function searchBar() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  ul = document.getElementById("suggestions");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "flex";
      } else {
          li[i].style.display = "none";
      }
  }
}

// au hover sur un nom de circuit -> affiche les infos
function displayInfo(element){
  //document.getElementById('visualiseCircuit').setAttribute("src" , ListOfCircuit[element][0] );
  document.getElementById('visualiseInfo').style.backgroundImage = "url("+ListOfCircuit[element][0]+")";
  document.getElementById('visualiseName').innerHTML= ListOfCircuit[element][1] ;
  document.getElementById('visualiseFlag').setAttribute("src" , ListOfCircuit[element][2] );
}

// fonction de selection de la course
function select(element){

  //stockage dans le localstorage
  storageRace = [ListOfCircuit[element][0] , ListOfCircuit[element][1] , ListOfCircuit[element][2] , ListOfCircuit[element][3]];
  localStorage.setItem("race_name", JSON.stringify(storageRace));

  for (let index = 0; index < ListOfCircuit.length; index++) {
      document.getElementById("race"+index+"").classList.remove("selected") 
  }
  document.getElementById("race"+element+"").classList.add("selected");
  document.getElementById("selectValidation").removeAttribute("disabled");
  document.getElementById("selectValidation").classList.remove("inactive");
  document.getElementById("selectValidation").innerHTML = "select "+ListOfCircuit[element][1]+""

  return storageRace ;
}

//fonction d'ajout d'un item
function addItem( lap1 , lap2 , lap3 ) {

  let lapTime = [ lap1 , lap2 , lap3 ];
  let TimeInMs = [];

  // convertion des temps en ms
  for (lap in lapTime)  {
    var times = lapTime[0].split(":");
    var Mtimes = times[0] * 60000;
    var Stimes = times[1] * 1000;
    var MStimes = times[2] * 1;
    var totalTimeMs = Mtimes + Stimes + MStimes;
    TimeInMs.push(totalTimeMs);
   } 

  // varibale de la moyenne des trois temps en ms
  var averageTime = JSON.stringify( Math.trunc( ( +TimeInMs[0] + +TimeInMs[1] + +TimeInMs[2] ) / 3 ) );
  //push de la variable dans le tableaux
  storage.push([userName.value, lt1.value, lt2.value, lt3.value, averageTime]);
  // envoi du tableau dans le localstorage
  localStorage.setItem("race_result", JSON.stringify(storage));

  //appel de la fonction de gap
  createGap();
  // fermeture de la popup player
  closePopupPlayer();
  return storage;
}

//fonction de suppression d'un item
function removeItem(witchItem) {

  //suppression de l'item
  storage.splice(witchItem, 1);
  //mise a jour du tableaux
  localStorage.setItem("race_result", JSON.stringify(storage));
  //appel de la fonction d'affichage de la liste
  createList();
  return storage;
}

//création des liste html
function createList() {
  var content = document.getElementById("result");
  content.innerHTML = "";
  let increment = 0;


  for (player in storage) {

    // creation de la variable gap 
    // convertion du temps en m:s:ms
    d = storage[player][4] - storage[0][4];
    s = Number(d);
    var m = Math.floor(d / 60000);
    var s = Math.floor( (d % 60000) / 1000);
    var ms = Math.floor( (d % 60000) % 1000);
    if (m == 0 ) {
      m = "";
    } else {
      m = m+"."
    }
    var gap = `+${m}${s}.${ms}`

    increment = increment + 1;
    content.innerHTML +=
      `
        <article id="item${increment}" class="hidden">
          <div>
            <span class="number bgc${player}" onclick="removeItem(${player})">${increment}</span> 
            <p class="name">${storage[player][0]}</p> 
          </div> 
          <div> 
            <p class="time1">${storage[player][1]}</p> 
            <p class="time2">${storage[player][2]}</p> 
            <p class="time3">${storage[player][3]}</p>
            <p class="gap" id="gap${player}">${gap}</p> 
            <p class="lap">3</p>
          </div>
        </article>
`;
  }

  // si il y à des player -> animation d'affichage 
  if (storage.length != 0){
      //animation -> remove la classe hiden des articles tout les 100ms
      (function myLoop(i) {
        setTimeout(function () {
          document.getElementById("item" + i + "").classList.remove("hidden");
          if (--i) myLoop(i);
        }, 100);
      })(storage.length);

  } else {
    openPopupPlayer();
  }


}

// gestion du formulaire d'ajout de player
document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  // reset des erreurs
  document.getElementById("error").innerHTML = "";

  // si les input son rempli et qu'ils respectent les regex
  if ( (userName.value && lt1.value && lt2.value && lt3.value != "") && ( lt1.value.match(regex) && lt2.value.match(regex) && lt3.value.match(regex)) ) {
    addItem( lt1.value , lt2.value , lt3.value); //appel de la fonction addItem()
  } else {
    //un input est vide
    if (userName.value == "") {
      // si le nom du player est vide
      document.getElementById("name").classList.add("invalid");
      document.getElementById("name").classList.remove("valid");
      document.getElementById("error").innerHTML +=
        "<p>Player name is missing</p>";
    } else {
      document.getElementById("name").classList.add("valid");
      document.getElementById("name").classList.remove("invalid");
    }
  
    if (lt1.value == "") {
      // si l'input est vide
      document.getElementById("lt1").classList.add("invalid");
      document.getElementById("lt1").classList.remove("valid");
      document.getElementById("error").innerHTML +=
        "<p>First lap time is missing</p>";
    } else if (!lt1.value.match(regex)) {
      //si l'input est remplis mais ne respecte pas la regex
      document.getElementById("lt1").classList.add("invalid");
      document.getElementById("lt1").classList.remove("valid");
      document.getElementById("error").innerHTML +=
      "<p>First lap format is incorrect </p>";
    } else {
      //si l'input est remplis & respecte la regex
      document.getElementById("lt1").classList.add("valid");
      document.getElementById("lt1").classList.remove("invalid");
    }
  
    if (lt2.value == "") {
      // si l'input est vide
      document.getElementById("lt2").classList.add("invalid");
      document.getElementById("lt2").classList.remove("valid");
      document.getElementById("error").innerHTML +=
        "<p>Second lap time is missing</p>";
      } else if (!lt2.value.match(regex)) {
        //si l'input est remplis mais ne respecte pas la regex
        document.getElementById("lt2").classList.add("invalid");
        document.getElementById("lt2").classList.remove("valid");
        document.getElementById("error").innerHTML +=
        "<p>Second lap format is incorrect </p>";
      } else {
        //si l'input est remplis & respecte la regex
        document.getElementById("lt2").classList.add("valid");
        document.getElementById("lt2").classList.remove("invalid");
      }
  
      if (lt3.value == "") {
      // si l'input est vide
      document.getElementById("lt3").classList.add("invalid");
      document.getElementById("lt3").classList.remove("valid");
      document.getElementById("error").innerHTML +=
        "<p>Third lap time is missing</p>";
      } else if (!lt1.value.match(regex)) {
        //si l'input est remplis mais ne respecte pas la regex
        document.getElementById("lt3").classList.add("invalid");
        document.getElementById("lt3").classList.remove("valid");
        document.getElementById("error").innerHTML +=
        "<p>Third lap format is incorrect </p>";
      } else {
        //si l'input est remplis & respecte la regex
        document.getElementById("lt3").classList.add("valid");
        document.getElementById("lt3").classList.remove("invalid");
      }
  }
});

// ouverture de la PopupPlayer d'ajout
function openPopupPlayer() {
  // reset des style des input
  document.getElementById("lt1").classList.remove("invalid");
  document.getElementById("lt1").classList.remove("valid");
  document.getElementById("lt2").classList.remove("invalid");
  document.getElementById("lt2").classList.remove("valid");
  document.getElementById("lt3").classList.remove("invalid");
  document.getElementById("lt3").classList.remove("valid");
  document.getElementById("name").classList.remove("invalid");
  document.getElementById("name").classList.remove("valid");
  // reset des champs
  userName.value = "";
  lt1.value = "";
  lt2.value = "";
  lt3.value = "";
  //reset des error
  document.getElementById("error").innerHTML = "";

  document.getElementById("PopupPlayer").style.display = "flex";
  setTimeout(() => {
    document.getElementById("PopupPlayer").classList.remove("hidden");
  }, 1);
}

// fermeture de la PopupPlayer d'ajout
function closePopupPlayer() {
  document.getElementById("PopupPlayer").classList.add("hidden");
  setTimeout(() => {
    document.getElementById("PopupPlayer").style.display = "none";
  }, 100);
}

// ouverture de la PopupRace de selection du circuit
function openPopupRace(){
  document.getElementById("PopupRace").style.display = "flex";
  setTimeout(() => {
    document.getElementById("PopupRace").classList.remove("hidden");
  }, 1);
}

// ouverture de la PopupRace de selection du circuit
function closePopupRace(){
  document.getElementById("PopupRace").classList.add("hidden");
  setTimeout(() => {
    document.getElementById("PopupRace").style.display = "none";
  }, 100);
}

// formatage de la value de input 
function formatInput(inputName){

    var inputLength = event.target.value.length;
    if(inputLength === 1 || inputLength === 4){
      var thisVal = event.target.value;
      thisVal += ':';
      inputName.value = thisVal;
    }

}

// fonction de trie des des player
// trie par bulle
function createGap(){

  let sorted = false;

  while( sorted == false ){
      sorted = true;

      for( let i = 0; i < storage.length; i++ ){
        console.log(i);
          if( storage[i + 1] !== undefined && +storage[i][4] > +storage[i + 1][4] ){
            console.log("i");
              let temp = storage[i + 1];
              storage[i + 1] = storage[i]
              storage[i] = temp;

              sorted = false
          }
      }
  }

  localStorage.setItem("race_result", JSON.stringify(storage));

  createList();
  return storage ;
}






document.getElementById("reset").addEventListener("click", function () {
  var msg= confirm("Vous allez effcer tout les scores, cette action est definitive. \n Êtes-vous sûre de vouloir continuer ?");

  if (msg == true){
    localStorage.clear();
    document.location.reload();
  }


});
