/// <reference types="vite/client" />

import * as ReactCustomerNamespace from "react-customer";
import * as Antd from "antd";

declare global {
  interface Window {
    ReactCustomer: ReactCustomerNamespace;
    __CUSTOMER_PLUGINS__: ReactCustomerNamespace.CustomProviderProps["plugins"];
    __CUSTOMER_CODE__: string;
    antd: Antd;
  }
}
