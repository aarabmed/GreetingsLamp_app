import React from "react";
import dynamic from 'next/dynamic';

import SelectLang from './components/SelectLang'


const Avatar =  dynamic(
  import('./components/AvatarDropdown')
)

function RightSide() {
  return (
    <>
      <div className="head-rightSide">
          <SelectLang />
          <Avatar />
      </div>
    </>
  );
}

export default React.memo(RightSide);
