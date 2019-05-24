import { Action, State, StateContext } from '@ngxs/store';
import { UserModel, User } from './animal.actions';

@State<any>({
  name: 'User',
  defaults: {
    name: '123',
    age: 0,
  },
})
export class AddUser {
  @Action(User) aUser(ctx: StateContext<UserModel>, action: User) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      ...action,
    });
  }
}
