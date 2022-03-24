import { v4 as uuidv4 } from "uuid";

import { MENUITEM } from "../defines";

const initialState = {
  collectionItem:undefined,
  categoryItem:undefined,
  subCategoryItem:undefined
};

export default function menuManagerReducer(state = initialState, action) {

  switch (action.type) {
    case MENUITEM.SET_MENUITEM_COLLECTION:
      return {
        ...state,
        collectionItem:action.item
      }

    case MENUITEM.SET_MENUITEM_CATEGORY:
      return {
        ...state,
        categoryItem:action.item
      };

    case MENUITEM.SET_MENUITEM_SUBCATEGORY:
      return {
          ...state,
          subCategoryItem:action.item
      };
    case MENUITEM.REMOVE_MENUITEM_CATEGORY:
      return {
        ...state,
        categoryItem:undefined,
        subCategoryItem:undefined
      };
    case MENUITEM.REMOVE_MENUITEM_SUBCATEGORY:
        return {
        ...state,
        subCategoryItem:undefined
    };
    case MENUITEM.RESET_MENUITEM:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
