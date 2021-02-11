import axios from 'axios';

class Model {
  constructor() {
    this.data = [];
    this.product = [];
    this.ingredients = [];
    this.favouriteProducts = [];
  }
  // get data based on typed query
  async searchData(query) {
    const items = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
    this.data = items.data.recipes;
    return this.data;
  }

  async searchProduct(id) {
    const item = await axios.get(`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
    this.product = item.data.recipe;
    return this.product;
  }
}

export default Model;