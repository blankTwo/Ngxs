export class User {
  static readonly type = 'User';
  constructor(public name: string, public age: number) {}
}

export interface UserModel {
  name: string;
  age: number;
}
