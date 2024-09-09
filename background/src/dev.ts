import * as ReactCustomer from "react-customer";
import * as React from "react";

if (import.meta.env.DEV) {
  window.React = React;
  window.ReactCustomer = ReactCustomer;
}
