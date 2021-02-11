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
      const regexp = /[a-zA-Z]+/g;
      // get input value and if it is proper
      const inputValue = this.view.getSearchInputValue();
      if(!regexp.test(inputValue)) { 
        this.view.displayAlertBox('Search field can only contain characters from A to Z');
        return false;
      } else {
        // if user type new value, reset values in the model
        this.model.data = []; 
        this.model.product = [];
        this.view.clearProductDetailsContainer();
        // show loader 
        this.view.showLoader(this.view.resultsList);
        // clear input value 
        this.view.clearSearchInput();
        this.model.searchData(inputValue).then(response => this.view.generateProductList(response));
      }
    }
    // after appending list to the DOM, attach event listener to the list element
    this.view.resultsList.addEventListener('click', e => this.handleProductDetails(e));
  }

  handleProductDetails(e) {
    const { target: { classList, dataset } } = e;
    if(classList.contains('results__item') && dataset.id) {
      this.view.showLoader(this.view.mealContainer);
      this.model.searchProduct(dataset.id).then(response => {
        this.view.generateProductDetails(response);
        this.handleFavouriteProducts();
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
      this.handleDeleteListItems();
      this.handleDeleteListItem();
    }));
  }

  handleFavouriteProducts() {
    // if element exists in the favourite products array, set dislike icon
    const setDislikeIcon = () => {
      const getAllFavourites = this.model.favouriteProducts.map(el => el.recipe_id);
      getAllFavourites.forEach(el => {
        const getByDataID = document.querySelector(`div[data-id='${el}'] .like-icon`);
        if(getByDataID) {
          getByDataID.name = 'heart-dislike-circle-outline';
        }
      });
    };
    // if favourite products array is empty, hide list by removing show class
    const checkIfIsEmpty = () => {
      if(this.model.favouriteProducts.length === 0) { 
        this.view.favouriteProducts.classList.remove('show');
      }
    }

    const handleAddDeleteListener = () => {
      this.view.favouriteProductIcon.addEventListener('click', e => {
        if(e.target.name === 'heart-circle-outline') {
          addFavouriteProduct(e.target);
        } else {
          deleteFavouriteProduct(e.target);
        }
      });
    }
    // adds favourite product at the begining of the array
    const addFavouriteProduct = target => {
      if(target.name === 'heart-circle-outline') {
        this.model.favouriteProducts.unshift(this.model.product);
        this.view.favouriteProducts.classList.add('show');
        this.view.generateFavouriteProductsList(this.model.favouriteProducts);
        setDislikeIcon();
      }
      generateFavouriteList();
    }
    // delete favourite product from the array
    const deleteFavouriteProduct = target => {
      if(target.name === 'heart-dislike-circle-outline') {
        target.name = 'heart-circle-outline';
        const parentID = target.parentNode.closest('[data-id]').dataset.id;
        const data = this.model.favouriteProducts.filter(el => el.recipe_id !== parentID);
        this.model.favouriteProducts = data;
        checkIfIsEmpty();
        this.view.generateFavouriteProductsList(this.model.favouriteProducts);
      }
      generateFavouriteList();
    }

    const generateFavouriteList = () => {
      Array.from(this.view.favouriteProductsItem).forEach(el => el.addEventListener('click', e => {
        const getID = e.target.dataset.id;
        const findProduct = this.model.favouriteProducts.find(el => el.recipe_id === getID);
        this.view.clearProductDetailsContainer();
        this.view.generateProductDetails(findProduct);
        setDislikeIcon();
        handleAddDeleteListener();
      }));
    }

    if(this.model.favouriteProducts.length !== 0) {
      setDislikeIcon();
    }
    handleAddDeleteListener();
  }

  initFunctions() {
    // init search typed query
    this.handleProductSearch();
    this.handleAddItemsToList();
  }
}

const app = new Controller(new Model(), new View());

app.initFunctions();