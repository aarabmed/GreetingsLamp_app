import { MENU } from "../defines";

export const setMainMenu = (globalMenu) => ({
  type: MENU.SET_MENU,
  globalMenu,
});

