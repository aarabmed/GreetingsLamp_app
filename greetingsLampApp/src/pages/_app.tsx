
import "../styles/styles.scss";
import "../styles/antd.less";
import { DeviceType } from "common/deviceType";

const wrappedApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
};



export default wrappedApp;
