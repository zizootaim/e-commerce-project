import React from "react";
import shoopingBag from "../assets/shopping.png";
import cartImg from "../assets/cartImg.svg";
import { connect } from "react-redux";
import "../App.css";
import { graphql } from "@apollo/client/react/hoc";
import { GET_CURRENCIES } from "../GraphQl/Queries";
import { withRouter } from "./SingleProduct/withRouter";
import { showCart, getTotal,showCurrenciesList,closeMenues,getQuantity } from "../Redux/CommonFunctions";
import Attributes from "./Attributes";
import { Link } from "react-router-dom";

class Navbar extends React.Component {
  state = {
    total: 0,
  };

  activateNavLink(e, cat) {
    this.props.filterProducts(cat);
    if (this.props.location.pathname != "/") {
      this.props.navigate("/");
    }
    Array.from(document.querySelectorAll(".nav__categories ul li")).forEach(
      (li) => {
        li.classList.remove("active");
      }
    );
    e.target.classList.toggle("active");
  }

 

  render() {
    const { categories, cartProducts, currentCurrency, changeAmount } =
      this.props;
      const categoriesList = categories
      ? categories.map((c, index) => {
          return (
            <li
              className="after"
              onClick={(e) => this.activateNavLink(e, c)}
              key={index}
            >
              {c}
            </li>
          );
        })
      : "";
    const currencies = this.props.data.currencies;
    const currenciesList = currencies
    ? currencies.map((c, index) => (
        <li
          className="currency"
          key={index}
          onClick={() => {
            showCurrenciesList();
            this.props.changeCurrency(c);
          }}
        >
          {c.symbol}
          {c.label}
        </li>
      ))
    : ""
    return (
      <nav>
        <div className="nav">
          <div className="nav__categories" onClick={closeMenues}>
            <ul>
              {categoriesList}
            </ul>
          </div>
          <div className="nav__bag flex" onClick={closeMenues}>
            <img className="bag__img" src={shoopingBag} alt="bag" />

          </div>
          <div className="nav__right">
            <div className="currencies__list__wrapper">
              <div
                className="currencies__list__top flex"
                onClick={() => showCurrenciesList()}
              >
                <span>{currentCurrency.symbol}</span>
                <i className="fas fa-angle-down"></i>
              </div>
              <ul className="currencies__list">
                {currenciesList}
              </ul>
            </div>
            <div className="mini__cart__wrapper flex">
              <div className="cart__img" onClick={() => showCart()}>
                <span className="center">{getQuantity(cartProducts)}</span>

                <img src={cartImg} alt="cart icon"  />
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
                                {currentCurrency.symbol + " " + p.total}
                              </span>
                              <Attributes
                                attributes={p.attributes}
                                productID={p.id}
                              />
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
                            <div className="cart__item__img">
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
                        Total:{" "}
                        <span>
                          {currentCurrency.symbol +
                            " " +
                            getTotal(this.props.cartProducts).total.toFixed(2)}
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
    currentCurrency: state.currentCurrency,
    cartProducts: state.cartProducts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
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
export default graphql(GET_CURRENCIES)(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar))
);
