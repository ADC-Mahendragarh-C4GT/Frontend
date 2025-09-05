import { useEffect, useState } from "react";

export default function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener("resize", handleResize);

    // Run once on mount
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full bg-white shadow"
      style={{
        display: "flex",
        margin: "0",
        padding: "0",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#bcbcbc",
        height: "70px",
      }}
    >
      <img
        src="/images/HaryanaGov.png"
        alt="Haryana Emblem"
        style={{
          display: "inline",
          marginRight: "16px",
          height: "70px",
          width: "8%",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "77%",
        }}
      >
        <h1
          className=" text-gray-800"
          style={{
            display: "inline",
            color: "#000",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          {isMobile ? "" : "Municipal Corporation Rohtak"}
        </h1>
      </div>
      <img
        src="/images/Azadi.png"
        alt="Azadi ka Amrit Mahotsav"
        className="h-10"
        style={{
          display: "inline",
          marginRight: "16px",
          height: "70px",
          width: "15%",
        }}
      />
    </header>
  );
}
