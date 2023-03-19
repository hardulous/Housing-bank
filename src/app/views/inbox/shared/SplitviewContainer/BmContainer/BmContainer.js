import React from "react";
import { useContext } from "react";
import CloseFile from "../../CloseFile";
import Remarks from "../../Remarks";
import YlowNotes from "../../YlowNotes";
import { SplitViewContext } from "../Worker";
import ViewOne from "./ViewOne";
import ViewTwo from "./ViewTwo";
import { BmContext } from "./Worker";

const BmContainer = () => {
  const { alignment } = useContext(SplitViewContext);
  const obj = useContext(BmContext);

  return (
    <>
      {alignment === "one" ? <ViewOne /> : <ViewTwo />}
      
      <Remarks/>

      <YlowNotes/>

      <CloseFile/>

    </>
  );
};

export default BmContainer;
