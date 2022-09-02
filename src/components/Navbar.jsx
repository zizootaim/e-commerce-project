import React from "react";
import shoppingBag from "../assets/shopping.png";
import cartImg from "../assets/cartImg.svg";
import { connect } from "react-redux";
import "../App.css";
import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { GET_CURRENCIES, GET_CATS, GET_PRODUCTS } from "../GraphQl/Queries";
import { withRouter } from "./SingleProduct/withRouter";
import { withApollo } from "@apollo/client/react/hoc";

import {
  showCart,
  getTotal,
  showCurrenciesList,
  closeMenues,
  getQuantity,
} from "../Redux/CommonFunctions";
import Attributes from "./Attributes";
import { Link } from "react-router-dom";

class Navbar extends React.Component {
  state = {
    total: 0,
  };

  componentDidUpdate() {
    const {
      Currencies: { currencies },
      Categories: { categories },
      setData,
    } = this.props;
    if (currencies && categories) {
      setData({ currencies, categories });
    }
  }
  runQuery(cat) {
    const { client, setProducts } = this.props;
    client
      .query({
        query: GET_PRODUCTS,
        variables: { name: cat },
      })
      .then((result) => {
        const {
          data: {
            category: { products },
          },
        } = result;
        
        setProducts(products);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  closeMenuesFromNav(e) {
    const parents = Array.from(e.nativeEvent.path).map((p) => p.className);
    if (parents.includes("mini__cart show")) {
      return;
    }
    if (parents.includes("mini__cart__wrapper flex")) showCart();
    else if (parents.includes("currencies__list__wrapper"))
      showCurrenciesList();
    else closeMenues();
  }
  activateNavLink(e, { name }) {
    this.props.filterProducts(name);
    if (this.props.location.pathname !== "/") {
      this.props.navigate("/");
    }
    this.runQuery(name);

    Array.from(document.querySelectorAll(".nav__categories ul li")).forEach(
      (li) => {
        li.classList.remove("active");
      }
    );
    e.target.classList.toggle("active");
  }

  render() {
    const {
      categories,
      currencies,
      cartProducts,
      currentCurrency,
      changeAmount,
    } = this.props;

    const categoriesList = categories
      ? categories.map((c, index) => (
          <li
            className={`${index === 0 ? "after active" : "after"}`}
            onClick={(e) => this.activateNavLink(e, c)}
            key={index}
          >
            {c.name}
          </li>
        ))
      : "";

    const currenciesList = currencies
      ? currencies.map((c, index) => (
          <li
            className="currency"
            key={index}
            onClick={() => {
              this.props.changeCurrency(c);
            }}
          >
            {c.symbol}
            {c.label}
          </li>
        ))
      : "";

    return (
      <nav onClick={this.closeMenuesFromNav}>
        <div className="nav">
          <div className="nav__left">
            <div className="nav__categories">
              <ul>{categoriesList}</ul>
            </div>
            <div className="nav__bag flex">
              <img className="bag__img" src={shoppingBag} alt="bag" />
            </div>
          </div>
          <div className="nav__right">
            <div className="currencies__list__wrapper">
              <div className="currencies__list__top flex">
                <span>{currentCurrency.symbol}</span>
                <i className="fas fa-angle-down"></i>
              </div>
              <ul className="currencies__list">{currenciesList}</ul>
            </div>
            <div className="mini__cart__wrapper flex">
              <div className="cart__img">
                {getQuantity(cartProducts) > 0 ? (
                  <span className="center">{getQuantity(cartProducts)}</span>
                ) : (
                  ""
                )}

                <img src={cartImg} alt="cart icon" />
              </div>
              <div className="mini__cart">
                {cartProducts.length > 0 ? (
                  <>
                    <h4>My Bag {getQuantity(cartProducts)} items</h4>
                    <div className="cart__items flex">
                      {cartProducts.map((p) => {
                       
                        return (
                          <div className="cart__item" key={p.id}>
                            <div className="cart__item__data flex">
                              <p>{p.name}</p>
                              <p> {p.brand}</p>
                              <span className="price">
                                {currentCurrency.symbol +
                                  " " +
                                  p.total}
                              </span>
                              <div className="attributes__container">
                                <Attributes
                                  attributes={p.attributes}
                                  productID={p.id}
                                />
                              </div>
                            </div>
                            <div className="cart__item__amount flex">
                              <button
                                className="cart__btn"
                                onClick={() => changeAmount(p.id, "INC")}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                              <span>{p.count}</span>
                              <button
                                className="cart__btn"
                                onClick={() => changeAmount(p.id, "DEC")}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                            </div>
                            <div className="cart__item__img mini__img">
                              <Link to={`/cart/SingleProduct/${p.id}`}>
                                <img src={p.gallery[0]} alt="pro" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mini__cart__bottom flex">
                      <h3>
                        Total:
                        <span>
                          {currentCurrency.symbol +
                            " " +
                            getTotal(this.props.cartProducts).total}
                        </span>
                      </h3>
                      <div className="cart__bottom__btns flex">
                        <button
                          className="secondary__btn main__btn"
                          onClick={() => {
                            showCart();
                            this.props.navigate("/cart");
                          }}
                        >
                          view bag
                        </button>
                        <button className="main__btn">check out</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <h1 className="center">Your Cart is Empty.</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    currencies: state.currencies,
    currentCurrency: state.currentCurrency,
    cartProducts: state.cartProducts,
    currentCategory: state.currentCategory,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data) => {
      dispatch({ type: "SET_DATA", payload: data });
    },
    setProducts: (products) => {
      dispatch({ type: "SET_PRODUCTS", payload: products });
    },
    filterProducts: (category) => {
      dispatch({ type: "FILTER__PRODUCTS", payload: category });
    },
    changeCurrency: (currency) => {
      dispatch({ type: "CHANGE_CURRENCY", payload: currency });
    },
    changeAmount: (id, operation) => {
      dispatch({ type: "CHANGE_AMOUNT", payload: { operation, id } });
    },
  };
};
export default withApollo(
  compose(
    graphql(GET_CURRENCIES, { name: "Currencies" }),
    graphql(GET_CATS, { name: "Categories" })
  )(connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar)))
);
