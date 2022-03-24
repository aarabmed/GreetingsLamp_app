import React from "react";


function Footer() {
  let currentDate = new Date();
  return (
      <div className="public-footer">
            <p>Copyright © {currentDate.getFullYear()} Orenji Inc. All rights reserved</p>
      </div>
  );
}

export default React.memo(Footer);
