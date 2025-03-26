import * as ReactCustomer from "react-customer";
import * as React from "react";
import * as antd from "antd";

if (import.meta.env.DEV) {
  window.React = React;
  window.ReactCustomer = ReactCustomer;
  window.antd = antd;
}
