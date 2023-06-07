import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}
const BasePage = (props: Props) => {
  return (
    <Navbar></Navbar>
  );
};

export default BasePage;