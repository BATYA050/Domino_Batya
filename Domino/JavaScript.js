//class Domino-מחלקה ליצוג כרטיס
class Domino {
  constructor(wordId, word, pictureId, picture) {
    this.picture = picture;
    this.word = word;
    this.pictureId = pictureId;
    this.wordId = wordId;
  }
}

////אתחול המשחק,המשמנים,המערכים
//pairsArr-מערך זוגות נכונים

let pairsArr = [
  { picture: "Adrime", word: "to Have a high apinion of something/someone" },
  { picture: "Nearby", word: "Not far away" },
  {
    picture: "Message",
    word: "* Centeral idea *A plce of news or reques sent to person ",
  },
  { picture: "A number of", word: "Paticular quantity or amount" },
  { picture: "Improve", word: "To became better" },
  { picture: "Effect", word: "Condition caused by something" },
  { picture: "Discover", word: "To find something" },
  { picture: "Force", word: "To use strong influence  to do/ get something " },
  { picture: "However", word: "Although that is true " },
  { picture: "Consider", word: "To take into account " },
  { picture: "Expect", word: " To believe thing to happen/apeson come" },
];
//dominosArr-מערך אבנים מוכנות
let dominosArr = [];

//הקוד של התמונה האחרונה שנבחרה
let prevId = 0;

start();

////לוגיקה

//start()-פונקציה לאתחול המשחק
function start() {
  create();
  buildDominos();
  initBourd();
  ruls();
  styleBourd();
}

//buildDominos()-פונקציה לבנית מערך האבנים
function buildDominos() {
  let domino1;
  for (let i = 0; i < pairsArr.length - 1; i++) {
    domino1 = new Domino(i, pairsArr[i].word, i + 1, pairsArr[i + 1].picture);
    dominosArr.push(domino1);
  }
  //הוספת הזוג האחרון
  domino1 = new Domino(
    pairsArr.length - 1,
    pairsArr[pairsArr.length - 1].word,
    pairsArr.length,
    "end!!!"
  );
  dominosArr.push(domino1);
  dominosArr = mixArr(dominosArr);
}

//mixArr(arr)-פונקציה לערבוב מערך
function mixArr(arr) {
  let newArr = [];
  while (arr.length > 0) {
    let index = Math.floor(Math.random() * arr.length);
    newArr.push(arr[index]);
    arr.splice(index, 1);
  }
  return newArr;
}

//dragStart- פונקציה לשמירת הזהות של הכרטיס הנגרר
function dragStart(event) {
  event.dataTransfer.setData("domino", event.target.id);
}

//drop(event)-פונקציה להעברת האלמנט הנגרר לחלל ושליחה לבדיקה
function drop(event) {
  event.preventDefault();
  let data = event.dataTransfer.getData("domino");
  event.target.appendChild(document.getElementById(data));
  check(document.getElementById(data));
}

//allowDrop(event)-פונקציה לאפשור הזריקה של הכרטיס לחלל
function allowDrop(event) {
  event.preventDefault();
}

//check(obj)-פונקציה לבדיקת תקינות הכרטיס שהועבר
function check(obj) {
  let sound = document.getElementById("sound");
  if (obj.wordId == prevId) {
    sound.src = "succeed.WAV";
    prevId = obj.pictureId;
    if (prevId == dominosArr.length) {
      sayVeryGood();
    } else
      document.getElementById(`card${prevId + 1}`).style.visibility = "visible";
  } else {
    sound.src = "mistake.WAV";
    sayWrong();
    let cardToMove = document.getElementById(obj.id);
    document.getElementById("allStack").appendChild(cardToMove);
  }
  sound.play();
}

////תצוגה ועיצוב

//createStack()-פונקצית להצגת המחסנית עם הכרטיסים
function createStack() {
  let stack = document.createElement("div");
  stack.style.display = "flex";
  stack.style.flexWrap = "wrap";
  stack.style.flexDirection = "column";
  stack.style.justifyContent = "space-between";
  stack.id = "allStack";
  for (let i = 0; i < dominosArr.length; i++) {
    dominosArr[i].id = `domino${i}`;
    let card = createDominoToBord(dominosArr[i]);
    card.id = `domino${i}`;
    card.wordId = dominosArr[i].wordId;
    card.pictureId = dominosArr[i].pictureId;
    card.ondragstart = () => {
      dragStart(event);
    };
    card.draggable = "true";
    stack.appendChild(card);
  }
  document.getElementById("gameDiv").appendChild(stack);
}

//addSpaces()-פונקציה להכנת החללים
function addSpaces() {
  let spacesBoard = document.createElement("div");
  spacesBoard.style.width = "80vw";
  spacesBoard.style.backgroundColor = "black";
  spacesBoard.style.height = "75vh";
  let space;
  let firstDomino = new Domino(0, "start", 1, pairsArr[0].picture);
  let firsrCard = createDominoToBord(firstDomino);
  for (var i = 0; i <= dominosArr.length; i++) {
    space = document.createElement("div");
    space.style.width = "20vw";
    space.style.height = "11vh";
    space.style.border = "6px solid white";
    space.style.borderRadius = "10px";
    space.style.visibility = "hidden";
    space.style.display = "flex";
    space.style.justifyContent = "space-around";
    space.style.alignContent = "space-around";
    space.style.flexWrap = "wrap";
    space.id = `card${i}`;
    space.id = `card${i}`;
    space.ondrop = () => {
      drop(event);
    };
    space.ondragover = () => {
      allowDrop(event);
    };
    if (i == 0) {
      space.appendChild(firsrCard);
    }
    spacesBoard.appendChild(space);
  }
  spacesBoard.style.display = "flex";
  spacesBoard.style.flexWrap = "wrap";
  spacesBoard.style.alignContent = "space-around";
  spacesBoard.style.justifyContent = "space-around";
  document.getElementById("gameDiv").appendChild(spacesBoard);
}

//createDominoToBord(dominoObj)-פונקציה להכנת הכרטיסים
function createDominoToBord(dominoObj) {
  let card = document.createElement("div");
  let wordInCard = document.createElement("div");
  let pictureInDiv = document.createElement("div");
  pictureInDiv.innerHTML = dominoObj.picture;
  pictureInDiv.style.width = "7.5vw";
  wordInCard.style.width = "7.5vw";
  wordInCard.style.height = "5.3vh";
  pictureInDiv.style.height = "5.3vh";
  pictureInDiv.style.paddingTop = "2vh";
  wordInCard.style.borderRight = "6px solid rgba(222,168,55,0.9)";
  //let img = document.createElement("img");
  //img.src = dominoObj.picture;
  //pictereInCard.appendChild(img);
  wordInCard.innerHTML = dominoObj.word;
  card.style.width = "15vw";
  card.style.height = "5.3vh";
  card.style.border = "6px solid";
  card.style.borderColor = "rgba(222,168,55,0.9)";
  card.style.borderRadius = "10px";
  card.style.display = "flex";
  card.style.boxShadow = "5px 2.5px 18px rgba(222,168,55,0.9)";
  card.appendChild(wordInCard);
  card.appendChild(pictureInDiv);
  return card;
}

//sayVeryGood()-פונקציה לסיום המשחק
function sayVeryGood() {
  let div = document.getElementById("allStack");
  div.style.fontFamily = " Papyrus, fantasy";
  div.style.color = " rgba(222,168,55,0.9)";
  div.style.fontSize = "200px";
  div.innerHTML = "very good";
}

//ruls()-פונקציה להצגת הוראות המשחק
function ruls() {
  let rulls = document.createElement("img");
  rulls.src = "rulls.jpg";
  rulls.style.position = "absolute";
  rulls.style.zIndex = "3";
  rulls.style.left = "10vw";
  rulls.style.top = "0vh";
  rulls.id = "rulls";
  setTimeout(() => {
    closeRulls();
  }, 3000);
  let screen = document.getElementById("screen");
  screen.appendChild(rulls);
}

//closeRulls()-פונקציה לסגירת כללי המשחק
function closeRulls() {
  document.getElementById("rulls").remove();
}

//sayWrong()-פונקציה להצגת הודעת שגיאה
function sayWrong() {
  let wrong = document.createElement("img");
  wrong.src = "mistake.jpg";
  wrong.style.position = "absolute";
  wrong.style.zIndex = "3";
  wrong.style.left = "20vw";
  wrong.style.top = "0vh";
  wrong.id = "wrong";
  setTimeout(() => {
    closeWrong();
  }, 3000);
  let screen = document.getElementById("screen");
  screen.appendChild(wrong);
}

//closeWrong()-פונקציה לסגירת הודעת שגיאה
function closeWrong() {
  document.getElementById("wrong").remove();
}

//initBourd()-פונקציה להצגת המשחק
function initBourd() {
  createStack();
  addSpaces();
  discover2Firsts();
}

//discover2Firsts()-פונקציה להצגת שני החללים הראשונים
function discover2Firsts() {
  let visiDiv = document.getElementById("card0");
  visiDiv.style.visibility = "visible";
  visiDiv = document.getElementById("card1");
  visiDiv.style.visibility = "visible";
}

//create()-פונקציה ליצירת את האלמנטים הבסיסים בלוח
function create() {
  let screen = document.createElement("div");
  let h1 = document.createElement("h1");
  let gameDiv = document.createElement("div");
  let audio = document.createElement("audio");
  let footer = document.createElement("div");
  gameDiv.id = "gameDiv";
  screen.id = "screen";
  audio.id = "sound";
  h1.id = "h1";
  footer.id = "footer";
  h1.innerHTML = "המשחק שלנו";
  footer.innerHTML = "©Batya Druk";
  //  & Rivki Rapaport"
  gameDiv.appendChild(audio);
  screen.appendChild(h1);
  screen.appendChild(gameDiv);
  screen.appendChild(footer);
  document.body.appendChild(screen);
}

//styleBourd()-פונקציה לעיצוב מראה הלוח
function styleBourd() {
  let screen = document.getElementById("screen");
  let h1 = document.getElementById("h1");
  h1.style.paddingTop = "1.5vw";
  h1.style.fontFamily = "Garamond,serif";
  h1.style.color = "rgba(222,168,55,0.9)";
  h1.style.fontSize = "50px";
  screen.style.backgroundColor = "black";
  screen.style.color = "white";
  screen.style.textAlign = "center";
  let footer = document.getElementById("footer");
  footer.style.height = "10vh";
  footer.style.color = "rgba(222,168,55,0.9)";
  footer.style.fontSize = "35px";
  footer.style.fontFamily = " Papyrus, fantasy";
  let gameDiv = document.getElementById("gameDiv");
  gameDiv.style.display = "flex";
  gameDiv.style.flexDirection = "row-reverse";
  gameDiv.style.justifyContent = "space-between";
}
