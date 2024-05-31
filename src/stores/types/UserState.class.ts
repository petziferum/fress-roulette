export default class UserState {
  firstName: string;
  lastName: string;
  email: string;
  lastLogin: Date;
  recipes: string[];
  id: string;
  userName: string;
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    lastLogin: Date,
    recipes: string[],
    id: string,
    userName: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.lastLogin = lastLogin;
    this.recipes = recipes;
    this.id = id;
    this.userName = userName;
  }
  // create builder pattern setter methods
  setFirstName(value: string): UserState {
    this.firstName = value;
    return this;
  }
  setLastName(value: string): UserState {
    this.lastName = value;
    return this;
  }
  setEmail(value: string): UserState {
    this.email = value;
    return this;
  }
  setLastLogin(value: Date): UserState {
    this.lastLogin = value;
    return this;
  }
  setRecipes(value: string[]): UserState {
    this.recipes = value;
    return this;
  }
  setUserName(value: string): UserState {
    this.userName = value;
    return this;
  }
  static createEmptyUserState(): UserState {
    return new UserState("", "", "", new Date(Date.now()), [], "", "");
  }
}
