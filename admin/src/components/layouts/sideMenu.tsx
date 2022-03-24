import React, { useEffect } from "react";
import Link from "next/link"; 
import { MENU_ADMIN } from "common/defines-admin";
import Menu from 'components/header/elements/components/menu'



function AdminLeftSidebar() {

  return (
    <>
    <div className="aside"></div>
    <div className="admin-sidebar">
      <div className="menu-logo">
              <Link href={process.env.PUBLIC_URL + "/admin/dashboard"}>
                <a>
                  <img
                    src="/assets/images/greetingslamp-logo-white.png"
                    alt="Logo"
                  />
                </a>
              </Link>
      </div>
      <div className="menu-line"></div>
      <div className="admin-sidebar__subcategory">
        <Menu items={MENU_ADMIN} className="__menu" />
      </div>
    </div>
    </>
  );
}

export default React.memo(AdminLeftSidebar);
