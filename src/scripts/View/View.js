class View {
  constructor() {
    this.searchInput = document.querySelector('#search-field');
    this.searchButton = document.querySelector('#search-button');
    this.resultsList = document.querySelector('.results__list');
    this.mealContainer = document.querySelector('.meal');
    this.shoppingList = document.querySelector('.shopping__list');
    // delete shopping list button
    this.addToListButton = null;
    this.deleteAllItemsButton = null;
    this.deleteListItem = null;
  }

  generateProductList(data) {
    let listItemsMarkup = '';
    data.forEach(el => {
      const { recipe_id, image_url, title, publisher } = el;
      listItemsMarkup += `<li id=${recipe_id} class="results__item">
                            <div class="results__box">
                              <img src=${image_url} alt="Result image" class="results__img" />
                            </div>
                            <div class="results__info">
                              <h5 class="results__title">
                                <span>${title}</span>
                              </h5>
                              <p class="results__text">${publisher}</p>
                            </div>
                          </li>`});
    // remove loader from the DOM
    this.removeLoader();
    // append generated list items to the list node
    this.resultsList.insertAdjacentHTML('afterbegin', listItemsMarkup);
  }

  generateProductDetails(product) {
    const { image_url, ingredients, title, publisher, source_url } = product;
    let productDetailsMarkup = `
      <div class="meal__header">
        <img src=${image_url} class="meal__img" />
        <span class="meal__bg"></span>
        <h2 class="meal__title--h2">
          <span>${title}</span>
        </h3>
      </div>
      <div class="meal__info"></div>
      <div class="meal__ingredients">
        <ul class="meal__list">
          ${ingredients.map((item, index) => (
              `<li id=${index} class="meal__item">
                <div><ion-icon class="meal__icon" name="checkmark-circle-outline"></ion-icon></div>
                <p class="meal__ingredient">${item}</p>
              </li>`
          )).join('')}
        </ul>
        <button type="button" class="button is-rounded is-info meal__button-add">
          <ion-icon name="cart-outline"></ion-icon>
          Add to shopping list
        </button> 
      </div>
      <div class="meal__instruction">
        <h5 class="title--h5">How to cook it</h5>
        <p class="meal__text">This recipe was carefully designed and tested by <strong>${publisher}</strong>.
        <br />
        Please check out directions at their website.</p>
        <a href=${source_url} target="_blank" class="meal__link">
          <button type="button" class="button is-rounded is-info meal__button-directions">
            directions
            <ion-icon name="caret-forward-outline"></ion-icon>
          </button>
        </a>
      </div>`;

    this.removeLoader();
    this.mealContainer.insertAdjacentHTML('afterbegin', productDetailsMarkup);
  }

  generateShoppingList(items) {
    let listItemMarkup = '';
    // creaet button responsible for deleting all elements from the shopping list
    let deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add('button','is-rounded', 'is-info', 'delete-all-btn');
    deleteBtn.id = 'delete-all-items';
    deleteBtn.innerText = 'delete all items';
    // clear shopping list before adding new ingredients...
    this.clearShoppingList();
    // ...and generate list items based on passed parameter
    items.forEach((el, index) => {
      listItemMarkup += `
        <li id=${index} class="shopping__item">
          <div>
            <input type="number" name="number" min="0" class="shopping__input" id="input-quantity" />
            <label for="input-quantity" class="shopping__unit">cup</label>
          </div>
          <p class="shopping__ingredients">
            ${el}
          </p>
          <button class="delete" data-id="delete-button"></button>
        </li>
      `;
    });
    // append list and button to the shopping list
    this.shoppingList.insertAdjacentHTML('afterbegin', listItemMarkup);
    this.shoppingList.prepend(deleteBtn);

    this.deleteListItem = document.querySelectorAll('button[data-id]');
    this.deleteAllItemsButton = document.querySelector('#delete-all-items');
  }

  clearShoppingList() {
    this.shoppingList.innerHTML = '';
    // remove button only if exists
    if(this.deleteAllItemsButton) { this.deleteAllItemsButton.remove(); }
  }

  clearSearchInput() {
    this.searchInput.value = '';
  }

  showLoader(node) {
    node.innerHTML = '';
    const loaderMarkup = 
    `<div class="loader-wrapper">
      <div class="loader"></div>
    </div>`;
    node.insertAdjacentHTML('afterbegin', loaderMarkup);
  }

  removeLoader() {
    const loader = document.querySelector('.loader');
    loader.remove();
  }
}

export default View;