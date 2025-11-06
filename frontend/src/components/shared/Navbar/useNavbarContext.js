import { createContext, useContext, useState } from "react";

export const NavbarContext = createContext();

export function useNavbarContext() {
  const navbarContext = useContext(NavbarContext);
  if (!navbarContext) {
    throw new Error(
      "useNavbarContext must be used within an NavbarProvider component!"
    );
  }
  return navbarContext;
}
