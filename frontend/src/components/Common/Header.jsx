import TopBar from "../Layout/TopBar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      {/*Top Bar*/}
      <TopBar />
      {/*navbar*/}
      <Navbar />
      {/*cartDrawer*/}
    </header>
  );
};

export default Header;
