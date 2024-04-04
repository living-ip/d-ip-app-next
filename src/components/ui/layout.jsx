import React, {useEffect, useState} from 'react'
import NavBar from "@/components/NavBar";
import {Footer} from "@/components/ui/footer";
import {cn} from "@/lib/utils";

export function Layout({children, childClassName, ...props}) {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    console.log('Navbar:', navbar);
    console.log('Footer:', footer);
    if (navbar && footer) {
      setNavbarHeight(navbar.offsetHeight);
      setFooterHeight(footer.offsetHeight);
      console.log('Navbar height:', navbar.offsetHeight);
      console.log('Footer height:', footer.offsetHeight);
    }
  }, []);

  return (
    <div {...props}>
      <div id="navbar" className="fixed top-0 w-full z-10 bg-white">
        <NavBar/>
      </div>
      <div className={cn('mx-auto max-w-full px-3 sm:px-16 lg:px-32 pt-24', childClassName)}
           style={{minHeight: `calc(100vh - ${navbarHeight}px - ${footerHeight}px + 108px)`}}>
        {children}
      </div>
      <div id="footer" className={"mx-auto max-w-full px-8 sm:px-16 lg:px-32 border-t border-gray-200"}>
        <Footer/>
      </div>
    </div>
  )
}