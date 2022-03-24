import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import {persistor} from "../redux/store";
import "../styles/antd.less";
import "../styles/styles.scss";

import withReduxStore from "../common/withReduxStore";

const App = ({ Component, pageProps, reduxStore }) => {
  return (
    <Provider store={reduxStore} >
      <PersistGate loading={null} persistor={persistor}>
           <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
};



export default withReduxStore(App);
