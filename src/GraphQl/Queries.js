import { gql } from "@apollo/client";

export const GET_DATA = gql`
  query {
    categories {
      name
      products {
        id
        name
        gallery
        description
        inStock
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;
export const GET_CATS = gql`
  query {
    categories {
      name
    }
  }
`;
export const GET_CURRENCIES = gql`
  query {
    currencies {
      label
      symbol
    }
  }
`;

export const GET_PRODUCT = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      gallery
      description
      inStock
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
    }
  }
`;
export const GET_PRODUCTS = gql`
  query ($name: String!) {
    category(input: { title: $name }) {
      name
      products {
        id
        name
        gallery
        description
        inStock
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;
