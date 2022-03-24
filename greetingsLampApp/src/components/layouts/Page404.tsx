import Head from "next/head";
import React from "react";
import Footer from "components/footer/Footer";
import TopMenu from "components/header/components/top-menu"
import PageNotFound from "assets/images/page-not-found"
import Link from "next/link";
import { Button } from "antd";

function Page404({menu}) {
  const logoIMG = '/assets/images/greetingslamp-logo.png'

  return (
    <>
        <Head><title>Page not found | Greetings Lamp</title></Head>
        {menu.length?<div className='public__header'>
              <TopMenu  logo={logoIMG} Elements={menu}/>
        </div>:null}
        <div className="content-error">
              <PageNotFound/>
              <Button><Link href='/'><a>Go Home</a></Link></Button>
        </div>
        <Footer/>
    </>
  );
}

export default React.memo(Page404);
