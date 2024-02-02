import { showHomepage } from "./homepage";

//Elements
export const navbar = document.createElement("div");
const h1_restaurantName = document.createElement("h1");
const nav_element = document.createElement("nav");
const ul_navElement = document.createElement("ul");

//clickable navbar elements
export const home = document.createElement("li");
export const menu = document.createElement("li");
export const contact = document.createElement("li");

//Navbar class
navbar.classList.add("navbar");

//Function appending elementms
export function navBar() {
  h1_restaurantName.innerText = "Sushi Place";
  home.innerText = "Home";
  menu.innerText = "Menu";
  contact.innerText = "Contact";
  navbar.appendChild(h1_restaurantName);
  nav_element.appendChild(ul_navElement);
  ul_navElement.appendChild(home);
  ul_navElement.appendChild(menu);
  ul_navElement.appendChild(contact);
  home.classList.add("active");

  navbar.appendChild(nav_element);
  return navbar;
}
