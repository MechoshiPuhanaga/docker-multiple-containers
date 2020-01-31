import React, { memo } from "react";
import { Link } from "react-router-dom";

const OtherPAge = () => {
  return (
    <div>
      Im some other page!
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default memo(OtherPAge);
