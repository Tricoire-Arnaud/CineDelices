const menuToggler = document.getElementById("menu-toggler");
const menuBurger = document.getElementById("menu-burger");
const closeMenuBurger = document.getElementById("close-menu-burger");

// afficher le menu burger
menuToggler.addEventListener("click", () => {
    menuBurger.classList.remove("hidden");
});
// cacher le menu burger
closeMenuBurger.addEventListener("click", () => {
    menuBurger.classList.add("hidden");
});