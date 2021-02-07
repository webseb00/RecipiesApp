import Model from './Model/Model';
import View from './View/View';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  handleProductSearch() {
    // listener responsible for catching enter key press event
    this.view.searchInput.addEventListener('keyup', e => {
      if(e.keyCode === 13) { handleGetData(); }
    });
    // listener responsible for catching click event
    this.view.searchButton.addEventListener('click', () => handleGetData());

    const handleGetData = () => {
      // show loader on the screen
      this.view.showLoader(this.view.resultsList);
      // get typed value from input
      const inputValue = this.view.searchInput.value;
      // clear input value 
      this.view.clearSearchInput();
      this.model.searchData(inputValue).then(response => {
        this.handleReceivedData(response);
      });
      // after appending list to the DOM, attach event listener to the list element
      this.view.resultsList.addEventListener('click', e => this.handleProductDetails(e));
    }
  }

  handleProductDetails(e) {
    if(e.target.classList.contains('results__item') && e.target.id) {
      this.view.showLoader(this.view.mealContainer);
      const productID = e.target.id;
      this.model.searchProduct(productID).then(response => {
        this.view.generateProductDetails(response);
      });
    }
  }

  handleAddItemsToList() {
    // if user clicks on product details, attach listener to button and pass ingredients list 
    this.view.mealContainer.addEventListener('click', e => {
      if(e.target.classList.contains('meal__button-add')) {
        // console.log(this.model.ingredients);
        const getProductIngredients = this.model.product.ingredients;
        this.model.ingredients.push(...getProductIngredients);
        // console.log(this.model.ingredients);
        this.view.generateShoppingList(this.model.ingredients);
        // call and assign listeners to delete all items and delete single item buttons
        this.handleDeleteListItems();
        this.handleDeleteListItem();
      }
    });
  }

  handleDeleteListItems() {
    // delete all data from ingredients and clear shopping list in the DOM
    this.view.deleteAllItemsButton.addEventListener('click', () => {
      const popup = confirm('Are you sure? The data will be lost permamently.');
      if(popup) {
        this.model.ingredients = [];
        this.view.clearShoppingList();
      }
    });
  }

  handleDeleteListItem() {
    Array.from(this.view.deleteListItem).map(el => el.addEventListener('click', e => {
      const parentID = Number(e.target.parentNode.id);
      const items = this.model.ingredients.filter((el, i) => i !== parentID);
      this.model.ingredients = items;
      this.view.generateShoppingList(this.model.ingredients);
      this.handleDeleteListItem();
    }));
  }

  handleReceivedData(data) {
    // pass received data from query and generate list in view 
    this.view.generateProductList(data);
  }

  initFunctions() {
    // init search typed query
    this.handleProductSearch();
    this.handleAddItemsToList();
  }
}

const app = new Controller(new Model(), new View());

app.initFunctions();