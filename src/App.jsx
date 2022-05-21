import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import Cart from "./components/Cart/Cart";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";
import { GET_DATA } from "./GraphQl/Queries";

class App extends React.Component {
  
  componentDidUpdate() {
    const { data } = this.props;
    console.log(data);
    if (!data.error) {
      this.props.getData(data.categories);
    }
  }
  render() {
    if(this.props.data.loading){
      return <h1 className="center" style={{marginTop:'5rem'}}>Loading...</h1>
    }
    return (
      <>
        {!this.props.data.error ? (<Router>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/singleProduct/:id" element={<SingleProduct />} />
            <Route path="cart/singleProduct/:id" element={<SingleProduct />} />
          </Routes>
        </Router>) : <h1 className="center" style={{marginTop:'5rem'}}>Error 404, Please Try again.</h1>}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (allData) => {
      dispatch({ type: "FETCH_DATA", payload: allData });
    },
  };
};
export default graphql(GET_DATA)(connect(null, mapDispatchToProps)(App));
