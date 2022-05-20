import React from "react";
import "./Cart.css";
import { connect } from "react-redux";
import Attributes from "../Attributes";
import { getTotal } from "../../Redux/CommonFunctions";
class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.slideNum = 0;
  }
  moveSlider(e, id, right) {
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
  getQuantity(arr) {
    let q = 0;
    arr.forEach((i) => {
      q += i.count;
    });
    return q;
  }
  render() {
    const { changeAmount, cartProducts, currentCurrency } = this.props;
    return (
      <section className="cart" id="cart">
    
        {cartProducts.length >= 1 ? (
          <div>
                <h1>Cart</h1>
            <div className="cart__items flex">
              {cartProducts.map((p) => {
                return (
                  <div className="item" key={p.id}>
                    <div className="item__data">
                      <h3 className="item__title">{p.name}</h3>
                      <div className="price">{p.price}</div>
                      <Attributes attributes={p.attributes} productID={p.id} />
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
                    <div className="item__slider" id={p.id}>
                      <div className="slide__btns">
                        <button
                          onClick={(e) => this.moveSlider(e, p.id, false)}
                        >
                          <i className="fas fa-angle-left"></i>
                        </button>
                        <button onClick={(e) => this.moveSlider(e, p.id, true)}>
                          <i className="fas fa-angle-right"></i>
                        </button>
                      </div>
                      <div className="slides">
                        {p.gallery.map((img, index) => {
                          return (
                            <div className="slide" key={index}>
                              <img src={img} alt="pro" />
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
                  {currentCurrency.symbol + " " + getTotal(cartProducts).tax}
                </span>
              </div>
              <div>
                <p>Quantity:</p>
                <span className="price">{this.getQuantity(cartProducts)}</span>
              </div>
              <div>
                <p>Total:</p>
                <span className="price">
                  {currentCurrency.symbol + " " + getTotal(cartProducts).total}
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
