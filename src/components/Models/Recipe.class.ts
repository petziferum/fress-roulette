export default class Recipe {
  recipeName: string;
  createdBy: string;
  tags: String[];

  constructor() {
    this.recipeName = "";
    this.createdBy = "";
    this.tags = [];
  }
}
