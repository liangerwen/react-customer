/// <reference types="vite/client" />

import * as ReactCustomerNamespace from "react-customer";

declare global {
  interface Window {
    ReactCustomer: ReactCustomerNamespace;
    __CUSTOMER_PLUGINS__: ReactCustomerNamespace.Plugin[];
    __CUSTOMER_CODE__: string;
  }
}
