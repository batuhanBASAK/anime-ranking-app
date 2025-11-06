import React, { useState } from 'react'
import { NavbarContext } from "./useNavbarContext";

function NavbarProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <NavbarContext.Provider
      value={{ open, setOpen }}
    >
      {children}
    </NavbarContext.Provider>
  )
}

export default NavbarProvider