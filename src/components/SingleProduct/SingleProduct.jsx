import React from "react";
import "./SingleProduct.css";
import { withRouter } from "./withRouter";
import { connect } from "react-redux";
import Attributes from "../Attributes";
import { showCart } from "../../Redux/CommonFunctions";

class SingleProduct extends React.Component {
  changeMainImg(e) {
    const newImg = e.target.src;
    e.target.src = document.querySelector(".main__img img").src;
    document.querySelector(".main__img img").src = newImg;
  }
  extractContent(html) {
    return new DOMParser().parseFromString(html, "text/html").documentElement
      .textContent;
  }
  render() {
    const id = this.props.params.id;
    let product = this.props.products.find((pro) => pro.id === id);
    if (this.props.location.pathname.includes("cart")) {
      product = this.props.cartProducts.find((pro) => pro.id == id);
    }

    
    return product ? (
      <section className={`${product.inCart ? 'single__product' : 'single__product out-cart'}`}>
        <div className="product__imgs">
          <div className="small__imgs">
            {product.gallery.slice(1).map((s, index) => {
              return (
                <img
                  src={s}
                  alt="img"
                  key={index}
                  onClick={this.changeMainImg}
                />
              );
            })}
          </div>
          <div className="main__img center">
            <img src={product.gallery[0]} alt="img" />
          </div>
        </div>
        <div className="product__data">
          <h3 className="item__title">{product.name}</h3>
          <div className="attributes__wrapper">
            <Attributes
              attributes={product.attributes}
              productID={product.id}
            />
          </div>

          <p>Price:</p>
          <div className="price">{product.price}</div>
          {!product.inCart ? (
            <button
              className="main__btn"
              onClick={() => {
                showCart(false);
                this.props.addToCart(product);
              }}
            >
              add to cart
            </button>
          ) : (
            ""
          )}
          <p className="desc">{this.extractContent(product.description)}</p>
        </div>
      </section>
    ) : (
      <p className="center" style={{ marginTop: "5rem" }}>
        Error , Please Try again.{" "}
      </p>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.products,
    cartProducts: state.cartProducts,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch({ type: "ADD_TO_CART", payload: product });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SingleProduct));
