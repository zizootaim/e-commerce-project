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
  addedProduct: {},
};
const FETCH_DATA = "FETCH_DATA";
const ADD_TO_CART = "ADD_TO_CART";
const CHANGE_ATTRIBUTES = "CHANGE_ATTRIBUTES";
const CHANGE_AMOUNT = "CHANGE_AMOUNT";
const CHANGE_CURRENCY = "CHANGE_CURRENCY";
const FILTER__PRODUCTS = "FILTER__PRODUCTS";
const ADD_PROD = "ADD_PROD";

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
        allProducts = [...allProducts, ...c.products].map((p) => {
          return { ...p, isAttributesChanged: false };
        });
      });

      allProducts = changeProductsPrices(allProducts, state.currentCurrency);

      return {
        ...state,
        categories,
        products: allProducts,
        filteredProducts: allProducts,
      };
    }
    case FILTER__PRODUCTS: {
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
      const old = state.cartProducts.filter(
        (p) => p.prevID == payload.id || p.prevID == payload.id
      );
      if (old[old.length - 1] && !old[old.length - 1].isAttributesChanged)
        return state;
      let newItem = { ...payload };
      if (!payload.inCart) {
        if (!payload.isAttributesChanged) {
          payload.attributes = payload.attributes.map((attr) => {
            const newItems = attr.items.map((i, index) => {
              if (index == 0) {
                return { ...i, selected: true };
              }
              return i;
            });
            return { ...attr, items: newItems };
          });
        }

        newItem = {
          ...payload,
          id: payload.id + Math.random(),
          prevID: payload.id,
        };
      }

      const newCartProducts = [...state.cartProducts, newItem].map((p) => {
        console.log("hello", p);
        return {
          ...p,
          inCart: true,
          count: 1,
          total: extractNumber(p.price),
        };
      });
      return {
        ...state,
        cartProducts: newCartProducts,
        addedProduct: {},
      };
    }
    case CHANGE_AMOUNT: {
      console.log(state.cartProducts);
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
      const existed = state.cartProducts.find((p) => p.id == payload.productID)
        ? true
        : false;
      if (!existed) {
        let newPro = state.products.find((p) => p.id == payload.productID);
        if (state.addedProduct.isAttributesChanged) {
          newPro = state.addedProduct;
        }
        console.log(newPro);
        let attributes = newPro.attributes.map((a) => {
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
        console.log(newPro.attributes);
        return {
          ...state,
          addedProduct: {
            ...newPro,
            attributes,
            isAttributesChanged: true,
          },
        };
      }
      const newCartProducts = state.cartProducts.map((pro) => {
        if (pro.id === payload.productID) {
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
            isAttributesChanged: true,
          };
        }
        return pro;
      });
      console.log(newCartProducts);
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
