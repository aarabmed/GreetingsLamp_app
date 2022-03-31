export const formatCurrency = (price, locales = "us-US", currency = "USD") => {
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currency,
  }).format(price);
};

// export const translateString = (string, language, API_key) => {
//   if (!API_key) {
//     return string;
//   } else {
//     let traslatedString;
//     return translate("Hello world", {
//       to: language,
//       key: API_key,
//     })
//       .then((res) => (traslatedString = res))
//       .catch((err) => console.log(err));
//   }
// };

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};



export const ENV = {
  SECRETCODE: process.env.SECRETCODE
};

export const FetchMenu = async (res) =>{
  return res.data.collections.filter((col)=>{
    if(col.status===true){
        return true
    }
  }).map(col=>{
    if(col.category){
      return ({_id:col._id,backgroundColor:col.backgroundColor,image:col.image,name:col.name,title:col.title,description:col.description,slug:col.slug,category:col.category.filter(cat=>cat.status===true).map(cat=>{
        if(cat.subCategory){
          return({_id:cat._id,backgroundColor:cat.backgroundColor,name:cat.name,title:cat.title,slug:cat.slug,subCategory:cat.subCategory.filter(e=>e.status===true)
            .map(sub=>({_id:sub._id,backgroundColor:sub.backgroundColor,title:sub.title,name:sub.name,slug:sub.slug}))})
        }
      })})
    }
  })
}