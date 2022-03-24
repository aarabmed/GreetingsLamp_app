import Head from "next/head";
import React, {useState,useRef} from "react";
import Footer from "components/footer/Footer";
import PageNotFound from "assets/images/page-not-found"
import Link from "next/link";
import { Button } from "antd";

type props ={
  homeButton?:boolean
}
export default function Page404({homeButton}:props) {
  return (
    <div className="error404-container">
        <div className="content-error">
            <PageNotFound/>
            {homeButton?<Button><Link href='/admin/dashboard'><a>Go Home</a></Link></Button>:null}
        </div>
    </div>
  );
}