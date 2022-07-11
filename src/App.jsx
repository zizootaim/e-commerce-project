import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import Cart from "./components/Cart/Cart";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";
import { GET_PRODUCTS } from "./GraphQl/Queries";

class App extends React.Component {
  componentDidUpdate() {
    const { data } = this.props;
    if (!data.error) {
      this.props.setData(data.category.products);
    }
  }
  render() {
    const {
      data: { loading, error },
    } = this.props;

    if (loading) {
      return <h1 className="center mt-5">Loading...</h1>;
    }
    return (
      <>
        {!error ? (
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/singleProduct/:id" element={<SingleProduct />} />
              <Route
                path="cart/singleProduct/:id"
                element={<SingleProduct />}
              />
            </Routes>
          </Router>
        ) : (
          <h1 className="center mt-5">{error.message}</h1>
        )}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data) => {
      dispatch({ type: "SET_PRODUCTS", payload: data });
    },
  };
};
const mapStateToProps = (state) => {
  return {
    currentCategory: state.currentCategory,
  };
};
export default graphql(GET_PRODUCTS, {
  options: () => {
    return { variables: { name: "all" } };
  },
})(connect(mapStateToProps, mapDispatchToProps)(App));
