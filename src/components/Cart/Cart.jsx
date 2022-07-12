import React from "react";
import "./Cart.css";
import { connect } from "react-redux";
import Attributes from "../Attributes";
import {
  getTotal,
  getQuantity,
  closeMenues,
} from "../../Redux/CommonFunctions";
import { Link } from "react-router-dom";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.slideNum = 0;
  }
  componentDidMount(){
    closeMenues()
  }
  moveSlider(id, right) {
    const slider = document.getElementById(id);

    const sliderLength = slider.querySelectorAll(".slide").length;

    if (right) {
      this.slideNum++;
    } else {
      this.slideNum--;
    }
    if (this.slideNum > sliderLength - 1) this.slideNum = 0;
    if (this.slideNum < 0) this.slideNum = sliderLength - 1;
    slider.querySelector(".slides").style.transform = `translate(-${
      this.slideNum * 200
    }px)`;
  }

  render() {
    const { changeAmount, cartProducts, currentCurrency } = this.props;
    return (
      <section className="cart" id="cart" onClick={closeMenues}>
        {cartProducts.length >= 1 ? (
          <div>
            <h1>Cart</h1>
            <div className="cart__items flex">
              {cartProducts.map((p) => {
                return (
                  <div className="item" key={p.id}>
                    <div className="item__data">
                      <h3 className="item__title">{p.name}</h3>
                      <p>{p.brand}</p>
                      <div className="price">{p.price}</div>
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
                        <div className="plus">
                          <svg
                            width="1"
                            height="17"
                            viewBox="0 0 1 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0.5 1V16" stroke="#1D1F22" />
                          </svg>
                          <svg
                            width="17"
                            height="1"
                            viewBox="0 0 17 1"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1 0.5H16" stroke="black" />
                          </svg>
                        </div>
                      </button>
                      <span>{p.count}</span>
                      <button
                        className="cart__btn"
                        onClick={() => changeAmount(p.id, "DEC")}
                      >
                        <div className="minus">
                          <svg
                            width="17"
                            height="1"
                            viewBox="0 0 17 1"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1 0.5H16" stroke="black" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div className="item__slider" id={p.id}>
                      {p.gallery.length > 1 ? (
                        <div className="slide__btns">
                          <button onClick={() => this.moveSlider(p.id, false)}>
                            <svg
                              width="8"
                              height="14"
                              viewBox="0 0 8 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.25 1.06857L1.625 6.6876L7.25 12.3066"
                                stroke="white"
                              />
                            </svg>
                          </button>
                          <button onClick={() => this.moveSlider(p.id, true)}>
                            <svg
                              width="8"
                              height="14"
                              viewBox="0 0 8 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.75 1.06857L6.375 6.6876L0.75 12.3066"
                                stroke="white"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="slides">
                        {p.gallery.map((img, index) => {
                          return (
                            <div className="slide center" key={index}>
                              <Link to={`/cart/SingleProduct/${p.id}`}>
                                <img
                                  src={img}
                                  alt="pro"
                                 
                                />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart__bottom">
              <div>
                <p>Tax 21%:</p>
                <span className="price">
                  {currentCurrency.symbol +
                    " " +
                    getTotal(cartProducts).tax.toFixed(2)}
                </span>
              </div>
              <div>
                <p>Quantity:</p>
                <span className="price">{getQuantity(cartProducts)}</span>
              </div>
              <div>
                <p>Total:</p>
                <span className="price">
                  {currentCurrency.symbol +
                    " " +
                    getTotal(cartProducts).total.toFixed(2)}
                </span>
              </div>
              <button className="main__btn">order</button>
            </div>
          </div>
        ) : (
          <h1 className="center">Your Cart is Empty.</h1>
        )}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartProducts: state.cartProducts,
    currentCurrency: state.currentCurrency,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeAmount: (id, operation) => {
      dispatch({ type: "CHANGE_AMOUNT", payload: { operation, id } });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
