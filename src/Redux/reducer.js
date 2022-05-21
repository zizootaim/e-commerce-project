const initialState = {
  products: [],
  filteredProducts: [],
  categories: [],
  currentCategory: "all",
  singleProductID: "",
  currentCurrency: {
    label: "USD",
    symbol: "$",
  },
  cartProducts: [],
};
const FETCH_DATA = "FETCH_DATA";
const ADD_TO_CART = "ADD_TO_CART";
const CHANGE_ATTRIBUTES = "CHANGE_ATTRIBUTES";
const CHANGE_AMOUNT = "CHANGE_AMOUNT";
const CHANGE_CURRENCY = "CHANGE_CURRENCY";
const FILTER__PRODUCTS = "FILTER__PRODUCTS";

const extractNumber = (str) => {
  var regex = /[+-]?\d+(\.\d+)?/g;
  var floats = str.match(regex).map(function (v) {
    return parseFloat(v);
  })[0];
  return floats;
};
const changeProductsPrices = (arr, currentCurrency) => {
  return arr.map((p) => {
    const c = p.prices.find((p) => {
      return p.currency.label == currentCurrency.label;
    });
    let price = c.currency.symbol + c.amount,
      total = "";
    if (p.price) {
      total = extractNumber(price) * p.count;
    }
    return { ...p, price: price, total: total };
  });
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_DATA: {
      const categories = payload.map((c) => c.name);
      let allProducts = [];
      payload.forEach((c) => {
        allProducts = [...allProducts, ...c.products];
      });

      allProducts = changeProductsPrices(allProducts, state.currentCurrency);
allProducts.forEach(p =>{
  if(p.inStock == false){
    console.log(p);
  }
  
})
      return {
        ...state,
        categories,
        products: allProducts,
        filteredProducts: allProducts,
      };
    }
    case FILTER__PRODUCTS: {
      console.log(payload);
      let newProducts = changeProductsPrices(
        state.products,
        state.currentCurrency
      ).filter((p) => p.category === payload);
      if (payload == "all")
        newProducts = changeProductsPrices(
          state.products,
          state.currentCurrency
        );
      return {
        ...state,
        currentCategory: payload,
        filteredProducts: newProducts,
      };
    }
    case CHANGE_CURRENCY: {
      return {
        ...state,
        products: changeProductsPrices(state.products, payload),
        filteredProducts: changeProductsPrices(state.filteredProducts, payload),
        cartProducts: changeProductsPrices(state.cartProducts, payload),
        currentCurrency: payload,
      };
    }
    case ADD_TO_CART: {
      if (state.cartProducts.find((p) => p.id === payload.id)) {
        return state;
      }
      const newCartProducts = [...state.cartProducts, payload].map((p) => {
        return {
          ...p,
          count: 1,
          total: extractNumber(p.price),
          choosenAttributes: [],
        };
      });

      return {
        ...state,
        cartProducts: newCartProducts,
      };
    }
    case CHANGE_AMOUNT: {
      const newCartProducts = state.cartProducts
        .map((pro) => {
          if (pro.id === payload.id) {
            if (payload.operation == "INC") pro.count++;
            else pro.count--;
          }

          return pro;
        })
        .filter((p) => p.count > 0);
      return {
        ...state,
        cartProducts: changeProductsPrices(
          newCartProducts,
          state.currentCurrency
        ),
      };
    }
    case CHANGE_ATTRIBUTES: {
      const newCartProducts = state.cartProducts.map((pro) => {
        if (pro.id === payload.productID) {
          const newAttr = {
            id: payload.attrID,
            value: payload.value,
            changed: false,
          };
          console.log(payload);
          console.log(pro);
          let attributes = pro.attributes.map((a) => {
            if (a.id == payload.attr.id) {
              const newItems = a.items.map((i) => {
                let selected = false;

                if (i.id == payload.attrItem.id) selected = true;
                return { ...i, selected };
              });
              return { ...a, items: newItems };
            }
            return a;
          });
      
          return {
            ...pro,
            attributes,
          };
        }
        return pro;
      });
      return {
        ...state,
        cartProducts: changeProductsPrices(
          newCartProducts,
          state.currentCurrency
        ),
      };
    }
  }
  return state;
};

export default reducer;
