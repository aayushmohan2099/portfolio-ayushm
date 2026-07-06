// src/components/Title/Header.jsx
import Left from "./HeaderComp/Left";
import Middle from "./HeaderComp/Middle";
import Right from "./HeaderComp/Right";

const Header = () => {
    return (
        <div className="h-full w-full grid grid-cols-[1fr_4fr_1fr]">
            <Left />
            <Middle />
            <Right />
        </div>
    );
};

export default Header;