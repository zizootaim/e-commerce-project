const initialState = {
  filteredProducts: [],
  categories: [],
  currencies: [],
  currentCategory: "all",
  currentCurrency: {
    label: "USD",
    symbol: "$",
  },
  cartProducts: [],
  addedProduct: {},
  singleProduct: "",
};
const SET_DATA = "SET_DATA";
const SET_PRODUCTS = "SET_PRODUCTS";
const ADD_TO_CART = "ADD_TO_CART";
const CHANGE_ATTRIBUTES = "CHANGE_ATTRIBUTES";
const CHANGE_AMOUNT = "CHANGE_AMOUNT";
const CHANGE_CURRENCY = "CHANGE_CURRENCY";
const FILTER__PRODUCTS = "FILTER__PRODUCTS";
const SET_SINGLE_PRODUCT = "SET_SINGLE_PRODUCT";

const extractNumber = (str) => {
  const regex = /[+-]?\d+(\.\d+)?/g;
  const floats = str.match(regex).map(function (v) {
    return parseFloat(v);
  })[0];
  return floats;
};
const changeProductsPrices = (arr, currentCurrency) => {
  return checkSameItems(
    arr.map((p) => {
      if (p) {
        const c = p.prices.find((p) => {
          return p.currency.label === currentCurrency.label;
        });
        let price = c.currency.symbol + c.amount.toFixed(2),
          total = "";
        if (p.price) {
          total = Number(extractNumber(price) * p.count).toFixed(2);
        }
        return { ...p, price: price, total };
      }
      return p;
    })
  );
};

const checkSameItems = (arr) => {
  if (arr.length > 1) {
    const newItem = arr[arr.length - 1];

    const prevItems = arr.filter(
      (p) => p.prevID === newItem.prevID && p.id !== newItem.id
    );
    let newArr = arr;
    prevItems.forEach((prevItem) => {
      if (prevItem && newItem.prevID === prevItem.prevID) {
        const prevAttr = prevItem.attributes.map((attr) => {
          return {
            id: attr.id,
            selectedItem: attr.items.filter((i) => i.selected)[0],
          };
        });
        const newAttr = newItem.attributes.map((attr) => {
          return {
            id: attr.id,
            selectedItem: attr.items.filter((i) => i.selected)[0],
          };
        });
        let sameNum = 0;
        prevAttr.forEach((p) => {
          newAttr.forEach((n) => {
            const isExisted = p.selectedItem && n.selectedItem;
            if (
              isExisted &&
              p.id === n.id &&
              p.selectedItem.value === n.selectedItem.value
            )
              sameNum++;
          });
        });
        if (sameNum === prevAttr.length) {
          newArr = arr
            .filter((p) => p.id !== newItem.id)
            .map((p) => {
              if (p.id === prevItem.id) {
                return { ...p, count: ++p.count, id: newItem.id };
              }
              return { ...p };
            });
        }
      }
    });
    return newArr;
  }
  return arr;
};
const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_PRODUCTS: {
      return {
        ...state,
        filteredProducts: changeProductsPrices(payload, state.currentCurrency),
      };
    }
    case SET_SINGLE_PRODUCT: {
      const p = changeProductsPrices([payload], state.currentCurrency);
      return {
        ...state,
        singleProduct: p[0],
      };
    }
    case SET_DATA: {
      const { categories, currencies } = payload;
      return {
        ...state,
        categories,
        currencies,
      };
    }
    case FILTER__PRODUCTS: {
      return {
        ...state,
        currentCategory: payload,
      };
    }
    case CHANGE_CURRENCY: {
      return {
        ...state,
        currentCurrency: payload,
        filteredProducts: changeProductsPrices(state.filteredProducts, payload),
        cartProducts: changeProductsPrices(state.cartProducts, payload),
        singleProduct: changeProductsPrices([state.singleProduct], payload)[0],
      };
    }
    case ADD_TO_CART: {
      const { product, single } = payload;
      let newItem = {};
      if (single) {
        if (state.addedProduct.id) newItem = state.addedProduct;
        else newItem = state.singleProduct;
      } else newItem = product;

      if (!newItem.isAttributesChanged) {
        newItem.attributes = newItem.attributes.map((attr) => {
          const newItems = attr.items.map((i, index) => {
            if (index === 0) {
              return { ...i, selected: true };
            }
            return i;
          });
          return { ...attr, items: newItems };
        });
      }

      const newCartProducts = [...state.cartProducts, newItem].map((p) => {
        if (p.id === newItem.id) {
          return {
            ...p,
            id: p.id + Math.random(),
            prevID: p.id,
            inCart: true,
            count: 1,
            total: extractNumber(p.price),
          };
        }
        return p;
      });

      return {
        ...state,
        cartProducts: checkSameItems(newCartProducts),
        addedProduct: {},
      };
    }
    case CHANGE_AMOUNT: {
      const newCartProducts = state.cartProducts
        .map((pro) => {
          if (pro.id === payload.id) {
            if (payload.operation === "INC") pro.count++;
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
      const { productID, attrItem, attr } = payload;
      const cartProduct = state.cartProducts.find((p) => p.id === productID);

      if (cartProduct) {
        const newCartProducts = state.cartProducts.map((p) => {
          if (p.id === productID) {
            const newAttributes = p.attributes.map((a) => {
              if (a.id === attr.id) {
                const newItems = a.items.map((i) => {
                  let selected = false;

                  if (i.id === attrItem.id) selected = true;
                  return { ...i, selected };
                });
                return { ...a, items: newItems };
              }
              return a;
            });
            return {
              ...p,
              isAttributesChanged: true,
              attributes: newAttributes,
            };
          }
          return p;
        });

        return {
          ...state,
          cartProducts: changeProductsPrices(
            newCartProducts,
            state.currentCurrency
          ),
        };
      }
      const currentPro = state.addedProduct.id
        ? state.addedProduct
        : state.singleProduct;
      const attributes = currentPro.attributes.map((a) => {
        if (a.id === attr.id) {
          const newItems = a.items.map((i) => {
            let selected = false;

            if (i.id === attrItem.id) selected = true;
            return { ...i, selected };
          });
          return { ...a, items: newItems };
        }
        return a;
      });

      return {
        ...state,
        addedProduct: {
          ...state.singleProduct,
          attributes,
          isAttributesChanged: true,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
