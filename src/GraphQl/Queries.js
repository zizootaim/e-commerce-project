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
