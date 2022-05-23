import React from "react";
import shoopingBag from "../assets/shopping.png";
import cartImg from "../assets/shopping-cart.png";
import { connect } from "react-redux";
import "../App.css";
import { graphql } from "@apollo/client/react/hoc";
import { GET_CURRENCIES } from "../GraphQl/Queries";
import { withRouter } from "./SingleProduct/withRouter";
import { showCart, getTotal } from "../Redux/CommonFunctions";
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

  showCurrenciesList(e) {
    // Close Mini Cart
    document.querySelector(".mini__cart").classList.remove("show");
    document.body.classList.remove("overlay");
    // Open and Close Currencies List
    let height = 0,
      iconDir = "";

    if (e.target.className == "fas fa-angle-down") iconDir = "up";
    else iconDir = "down";
    Array.from(document.querySelector(".currencies__list").children).forEach(
      (li) => {
        height += li.getBoundingClientRect().height;
      }
    );

    if (iconDir == "down") height = 0;

    e.target.className = `fas fa-angle-${iconDir}`;
    document.querySelector(".currencies__list").style.height = height + "px";
  }

  render() {
    const { categories, cartProducts, currentCurrency, changeAmount } =
      this.props;
    const currencies = this.props.data.currencies;
    return (
      <nav>
        <div className="nav">
          <div className="nav__categories">
            <ul>
              {categories
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
                : ""}
            </ul>
          </div>
          <div className="nav__bag flex">
            <img className="bag__img" src={shoopingBag} alt="bag" />

            {/* <i class="fas fa-redo"></i> */}
          </div>
          <div className="nav__right">
            <div className="currencies__list__wrapper">
              <div className="currencies__list__top flex">
                <span>{currentCurrency.symbol}</span>
                <i
                  className="fas fa-angle-down"
                  onClick={(e) => this.showCurrenciesList(e)}
                ></i>
              </div>
              <ul className="currencies__list">
                {currencies
                  ? currencies.map((c, index) => (
                      <li
                        className="currency"
                        key={index}
                        onClick={() => this.props.changeCurrency(c)}
                      >
                        {c.symbol}
                        {c.label}
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
            <div className="mini__cart__wrapper flex">
              <div className="cart__img">
                <span>{cartProducts.length}</span>
                <img
                  src={cartImg}
                  alt="cart icon"
                  onClick={() => showCart()}
                />
              </div>
              <div className="mini__cart">
                {cartProducts.length > 0 ? (
                  <>
                    <h4>My Bag {cartProducts.length} items</h4>
                    <div className="cart__items flex">
                      {cartProducts.map((p) => {
                        return (
                          <div className="cart__item" key={p.id}>
                            <div className="cart__item__data flex">
                              <p>{p.name}</p>
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
                            getTotal(this.props.cartProducts).total}
                        </span>
                      </h3>
                      <div className="cart__bottom__btns flex">
                        <button
                          className="secondary__btn main__btn"
                          onClick={() => {
                            showCart()
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
                  <h1 className="center" style={{ padding: "2rem 0" }}>
                    Your Cart is Empty.
                  </h1>
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
