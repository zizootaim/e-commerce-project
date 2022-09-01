import React from "react";
import "./SingleProduct.css";
import { withRouter } from "./withRouter";
import { connect } from "react-redux";
import Attributes from "../Attributes";
import { closeMenues } from "../../Redux/CommonFunctions";
import { GET_PRODUCT } from "../../GraphQl/Queries";
import { withApollo } from "@apollo/client/react/hoc";

class SingleProduct extends React.Component {
  state = {
    loading: false,
  };
  changeMainImg(e) {
    const newImg = e.target.src;
    e.target.src = document.querySelector(".main__img img").src;
    document.querySelector(".main__img img").src = newImg;
  }
  extractContent(html) {
    return new DOMParser().parseFromString(html, "text/html").documentElement
      .textContent;
  }
  componentDidMount() {
    closeMenues();
    this.runQuery();
  }
  runQuery() {
    const {
      client,
      setProduct,
      params: { id },
    } = this.props;
    this.setState({ loading: true });
    client
      .query({
        query: GET_PRODUCT,
        variables: { id },
      })
      .then((result) => {
        const {
          data: { product },
        } = result;

        this.setState({ loading: false });
        setProduct(product);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  removeSelectedClass() {
    Array.from(document.querySelectorAll(".single__product .attr")).forEach(
      (a) => {
        a.classList.remove("selected");
      }
    );
    Array.from(document.querySelectorAll(".single__product .size")).forEach(
      (a) => {
        a.classList.remove("selected");
      }
    );
    Array.from(document.querySelectorAll(".single__product .color")).forEach(
      (a) => {
        a.classList.remove("selected");
      }
    );
  }
  render() {
    const {
      params: { id },
      cartProducts,
      addedProduct,
      addToCart,
      location: { pathname },
    } = this.props;
    let product = this.props.singleProduct;
    if (pathname.includes("cart"))
      product = cartProducts.find((pro) => pro.id === id);

    if (this.state.loading) {
      return <h1 className="center mt-5">Loading...</h1>;
    }
    return product ? (
      <section
        className={`${
          product.inStock
            ? "single__product"
            : "single__product out-of-stock after"
        }`}
        onClick={closeMenues}
      >
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
          <div className="main__img ">
            <img src={product.gallery[0]} alt="img" />
          </div>
        </div>
        <div className="product__data">
          <h3 className="item__title">{product.name}</h3>
          <h3 className="item__title">{product.brand}</h3>
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
                const { isAttributesChanged, attributes } = addedProduct;
                if (isAttributesChanged) {
                  let isAttributesChecked = false;

                  for (let i in attributes) {
                    for (let j of attributes[i].items) {
                      if (j.selected === undefined) {
                        isAttributesChecked = false;
                        break;
                      } else {
                        isAttributesChecked = true;
                      }
                    }
                  }
                  if (isAttributesChecked) {
                    addToCart(this.props.addedProduct);
                    this.removeSelectedClass();
                  }
                }
              }}
            >
              add to cart
            </button>
          ) : (
            ""
          )}

          <div
            className="desc"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
        </div>
      </section>
    ) : (
      <p className="center mt-5">Error , Please Try again. </p>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.products,
    cartProducts: state.cartProducts,
    addedProduct: state.addedProduct,
    singleProduct: state.singleProduct,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch({ type: "ADD_TO_CART", payload: { single: true, product } });
    },
    setProduct: (product) => {
      dispatch({ type: "SET_SINGLE_PRODUCT", payload: product });
    },
  };
};

export default withApollo(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(SingleProduct))
);
