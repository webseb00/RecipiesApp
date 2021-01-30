
const init = () => {
  const app = document.querySelector('#app');
  const h1 = document.createElement('h1');
  h1.textContent = "Let's do it with Webpack and Bulma!";
  h1.classList.add("is-size-1", "has-text-link", "mb-4");
  app.appendChild(h1);
}

init();