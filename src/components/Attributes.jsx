import React from "react";
import { connect } from "react-redux";

class Attributes extends React.Component {
  render() {
    const chooseAttr = (e, attr, attrItem) => {
      const existed = this.props.cartProducts.find(
        (p) => p.id === this.props.productID
      )
        ? true
        : false;
      if (!existed) {
        Array.from(e.target.parentElement.children).forEach((s) => {
          s.classList.remove("selected");
        });
        e.target.classList.add("selected");
      }
      this.props.changeAttribute(this.props.productID, attr, attrItem);
    };

    return (
      <>
        {this.props.attributes.map((attr) => {
          if (attr.id === "Size") {
            return (
              <div key={attr.id}>
                <p>Sizes:</p>
                <div className="sizes flex">
                  {attr.items.map((s) => (
                    <span
                      className={`${s.selected ? "size selected" : "size"}`}
                      key={s.id}
                      onClick={(e) => chooseAttr(e, attr, s)}
                    >
                      {s.value}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          if (attr.id === "Color") {
            return (
              <div key={attr.id}>
                <p>Color:</p>
                <div className="colors flex">
                  {attr.items.map((c, index) => {
                    return (
                      <span
                        key={index}
                        className={`${
                          (c.id === "White" ? "border " : "") +
                          (c.selected ? "color selected" : "color")
                        }`}
                        style={{ backgroundColor: c.value }}
                        onClick={(e) => chooseAttr(e, attr, c)}
                      ></span>
                    );
                  })}
                </div>
              </div>
            );
          }
          return (
            <div key={attr.id}>
              <p>{attr.name}</p>
              {attr.items.map((i) => {
                return (
                  <span
                    key={i.id}
                    className={`${i.selected ? "attr selected" : "attr"}`}
                    onClick={(e) => chooseAttr(e, attr, i)}
                  >
                    {i.value}
                  </span>
                );
              })}
            </div>
          );
        })}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
    cartProducts: state.cartProducts,
    addedProduct: state.addedProduct,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeAttribute: (productID, attr, attrItem) => {
      dispatch({
        type: "CHANGE_ATTRIBUTES",
        payload: { productID, attr, attrItem },
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Attributes);
