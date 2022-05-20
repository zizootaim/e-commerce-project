import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { showCart } from "../Redux/CommonFunctions";
class Home extends React.Component {
  render() {
    const { currentCategory, filteredProducts,addToCart } = this.props;
    return (
      <section className="home" id="home">
        <div className="cat__name">
          <h1>{currentCategory}</h1>
        </div>
        <div className="products__wrapper">
          {filteredProducts ? (
            filteredProducts.map((p, index) => {
              return (
                <div className="product" key={index}>
                  <Link to={`SingleProduct/${p.id}`}>
                    <div className="product__img center">
                      <img src={p.gallery[0]} alt="img" />
                    </div>
                  </Link>
                  <div className="product__data">
                    <p className="name">{p.name}</p>
                    <div className="price">{p.price}</div>
                  </div>
                  <div className="add__to__cart__icon center" onClick={() => {
                    showCart(false)
                    addToCart(p)}}>
                    <i className="fas fa-cart-plus"></i>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="center">Error 404, Please Try again.</h1>
          )}
        </div>
      </section>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    filteredProducts: state.filteredProducts,
    currentCategory: state.currentCategory,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch({ type: "ADD_TO_CART", payload: product });
    },
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Home);
