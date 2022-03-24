import React from "react";
import { Row, Col } from "antd";


function Footer() {
  return (
    <Row className="footer">
        <div className="footer-body">
            <p>Copyright © 2022 Orenji Inc. All rights reserved</p>
      </div>
    </Row>
  );
}

export default React.memo(Footer);
