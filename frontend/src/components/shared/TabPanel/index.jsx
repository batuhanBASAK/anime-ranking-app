import { Box } from "@mui/material";
import { useLayoutEffect, useState } from "react";

function TabPanel({ children, currVal, tabVal }) {
  const [display, setDisplay] = useState(false);


  useLayoutEffect(() => {
    setDisplay(() => currVal === tabVal);
  }, [currVal, tabVal]);


  return (display ? (<Box>
    {children}
  </Box>) : (<></>)
  );
}

export default TabPanel;
