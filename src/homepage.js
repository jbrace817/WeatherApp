import { navbar } from "./navBar";
import ImgWordForSushi from "./images/sushi_japanese.png";
import ImgPlateOfSushi from "./images/Component 9.png";

//Elements
const div_mainContainer = document.createElement("div");

//Div containing the ImgWordForSushi image
const div_outerWordForSushi = document.createElement("div");

//Hompage Text
const div_textContainer = document.createElement("div");
const p_text = document.createElement("p");

//Classnames added to the elements
div_mainContainer.classList.add("mainContent");
div_outerWordForSushi.classList.add("outerWord");
div_textContainer.classList.add("text");

//Images
const wordSushi = new Image();
wordSushi.src = ImgWordForSushi;
wordSushi.alt = 'Japenese caligraphy for the word "sushi"';
wordSushi.classList.add("word");

const plate = new Image();
plate.src = ImgPlateOfSushi;
plate.alt = "Plate of sushi";
plate.classList.add("plate");

//Paragraph of text
p_text.textContent =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eaque, dolorem laboriosam consequuntur perspiciatisplaceat. Porro doloremque nulla eos, quaerat nemo temporibus id eligendi laborum tempora laudantium. Quo, numquam. Possimus! Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam facere voluptatem beatae,repellendus, veniam blanditiis";

//Function that creates the elements
export function showHomepage() {
  //Offset of navbar
  let offset = navbar.offsetHeight;
  //elements
  div_mainContainer.classList.remove("hidden");
  div_outerWordForSushi.appendChild(wordSushi);
  div_textContainer.appendChild(p_text);
  div_mainContainer.appendChild(plate);
  div_mainContainer.appendChild(div_outerWordForSushi);
  div_mainContainer.appendChild(div_textContainer);
  console.log(offset);

  // div_mainContainer.style.height = "calc(100vh - " + offset + "px)";
  document.documentElement.style.setProperty("--nav-height", `${offset}px`);

  screen.orientation.addEventListener("change", () => {
    document.documentElement.style.setProperty("--nav-height", `${offset}px`);
    window.location.reload();
    console.log(navbar.offsetHeight);
  });
  console.log(offset);
  return div_mainContainer;
}

//Function to hide elements
export function hideHomepage() {
  div_mainContainer.classList.add("hidden");
  return div_mainContainer;
}
