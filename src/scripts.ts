// Definēt mainīgos
const colorsArray: string[] = ['yellow', 'green', 'blue'];
let colorsPickList: string[] = [...colorsArray, ...colorsArray];
const cardCount: number = colorsPickList.length;

//Definēju mainīgo, lai ielādējoties lapai parādās poga ar aicinājumu uzsākt spēli.
const startMessage = document.querySelector<HTMLDivElement>('.js-start');
document.addEventListener('DOMContentLoaded', () => {
	startMessage.innerHTML = "Start Game"; //Teksts
	startMessage.addEventListener("click", () => { // Lai nospiežot pogu,...
		startMessage.style.opacity = '0'; // ...tā pazūd
		startMessage.style.zIndex = '0'; // .. un atceļas zIndex, kas ļāva redzēt pa virsu kārtīm
		}
	);
});

// Sākums
let revealedCards: number = 0; // Atklāto karšu skaitu. Sākotnēji ir 0
let activeCard: HTMLDivElement | null = null; // Nospiestā jeb aktivizētā kārts
let awaitingEndOfMove: boolean = false; // Lai nevirina visas kārtis pēc kārtas. True būs tad, kad atradīs otru kārti

// Jāizveido funkcija, kas radīs kārti un izvadīs to:
const handleCardClick = (element: HTMLDivElement, color: string): HTMLDivElement => {
  element.setAttribute("card-color", color); // Iestata 'card-color' atribūtu HTMLDivElementam. Salīdzina (ja abas kārtis vienā krāsā === match)
  element.setAttribute("card-revealed", "false"); // Iestata atribūtu uz false
	element.addEventListener("click", () => {
		const revealed = element.getAttribute("card-revealed"); // Iegūstam atribūta vērtību.
		// Lai novērstu lieku klikšķināšanu. Liekam lietā iepriekš definēto awaitingEndOfMove
		if (awaitingEndOfMove || revealed === "true" || element === activeCard) {
			return;
 		};

		//Izsaukt krāsas maiņu:
		element.style.backgroundColor = color; 
		if (!activeCard) {
			activeCard = element;
			return;
		};

		// Salīdzināsim sakrīt setAttribute. Ja jā - otrais setAttribute uz true
		const colorToMatch = activeCard.getAttribute("card-color");

    if (colorToMatch === color) {
      activeCard.setAttribute("card-revealed", "true");
      element.setAttribute("card-revealed", "true");
      awaitingEndOfMove = false;
      activeCard = null;
      revealedCards += 2;

      if (revealedCards === cardCount) {
        displayWinner();
      }
	    return;
    };

		// Ja krāsas nesakrīt, notīrīt vērtības
    awaitingEndOfMove = true;

    setTimeout(() => {
      element.style.backgroundColor = null;
      activeCard.style.backgroundColor = null;
      awaitingEndOfMove = false;
      activeCard = null;
    }, 1000);
  });
  return element;
};

// Kāršu krāsas randomaizeris
const cardsArray: Element[] = Array.from(document.querySelectorAll(".js-card"));
for (let i = 0; i < cardCount; i++) {
  const randomIndex = Math.floor(Math.random() * colorsPickList.length);
  const color: string = colorsPickList[randomIndex]; //Lai krāsas rotētu
  colorsPickList.splice(randomIndex, 1); //Lai krāsas atkārtotos tikai 2 reizes
  const currentCard: HTMLDivElement = cardsArray[i] as HTMLDivElement;
  const card: HTMLDivElement = handleCardClick(currentCard, color);
};

// Lai parādītos YOU WIN logs
const displayWinner = () => {
	const overlay = document.querySelector<HTMLElement>(".js-overlay");
	if (overlay) {
		overlay.style.display = "flex";
	}
};

// Lai logā parādās poga atkārtotai spēlei
const resetGame = () => {
  window.location.reload();
}
const playButton = document.querySelector('.js-button-play');
  if (playButton) {
  playButton.addEventListener('click', resetGame);
};