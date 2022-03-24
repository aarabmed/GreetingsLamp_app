import { MENU } from "../defines";

const initialState = {
  menu:[]
};

export default function menuReducer(state = initialState, action) {

  switch (action.type) {
    case MENU.SET_MENU:
      return {
        ...state,
        menu:action.globalMenu
      }
    default:
      return state;
  }
}
