import { GLOBAL } from "../defines";

export const setGlobalLanguage = (lang) => ({
  type: GLOBAL.SET_LANGUAGE,
  lang,
});

export const setGlobalCategory = (category) => ({
  type: GLOBAL.SET_CATEGORY,
  category,
});

export const setRoute = (route) => ({
  type: GLOBAL.SET_ROUTE,
  route,
});


