import { MENUITEM } from "../defines";

export const setItemCollection = (item) => ({
  type: MENUITEM.SET_MENUITEM_COLLECTION,
  item,
});

export const setItemCategory = (item) => ({
  type: MENUITEM.SET_MENUITEM_CATEGORY,
  item,
});

export const setItemSubCategory = (item) => ({
  type: MENUITEM.SET_MENUITEM_SUBCATEGORY,
  item,
});

export const removeItemCategory = () => ({
  type: MENUITEM.REMOVE_MENUITEM_CATEGORY,
});
export const removeItemSubCategory = () => ({
  type: MENUITEM.REMOVE_MENUITEM_SUBCATEGORY,
});

export const resetMenuItem = () => ({
  type: MENUITEM.RESET_MENUITEM,
})

