// src/components/Title/Header.jsx
import Left from "./HeaderComp/Left";
import Middle from "./HeaderComp/Middle";
import Right from "./HeaderComp/Right";

const Header = ({ shouldStartMusic }) => {
  return (
    <div className="relative z-50 min-h-[60px] md:h-full w-full flex flex-col md:grid md:grid-cols-[1fr_5fr_1fr] lg:grid-cols-[1fr_4fr_1fr] items-center justify-center gap-4 md:gap-0 overflow-visible pointer-events-auto">
      <Left shouldStartMusic={shouldStartMusic} />
      <Middle />
      <Right />
    </div>
  );
};

export default Header;
