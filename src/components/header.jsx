export default function Header() {
  return (
    // <header
    //   className="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full z-50"
    //   style={{ paddingTop: 0, marginTop: 0 }}
    // >
    //   <nav className="m-2">
    //     <div className="inline m-auto justify-between flex items-center">
    //       <li style={{ display: "inline", marginRight: "16px" }} className="self-start">
    //         <img
    //           src="/images/HaryanaGov.jpg"
    //           alt="Govt of Haryana"
    //           height={80}
    //             width={80}
    //           style={{ maxWidth: "100%" }}
    //         />
    //       </li>
    //       <li style={{ display: "inline", marginRight: "16px", color: "#000" }} className="self-end">
    //         Municipal Corporation Rohtak
    //       </li>
    //       <li style={{ display: "inline", marginLeft: "1px"}}>
    //         <img
    //           src="/images/HaryanaGov.jpg"
    //           alt="Govt of Haryana"
    //           height={80}
    //           width={80}
    //           style={{ maxWidth: "100%" }}
    //         />
    //       </li>
    //     </div>
    //   </nav>
    // </header>

    <header
      className="fixed top-0 left-0 w-full bg-white shadow"
      style={{
        display: "flex",
        margin: "0",
        padding: "0",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#bcbcbc",
        height:"70px",
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
        className="h-10"
      />
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "77%"}}>
        <h1
          className="font-bold text-gray-800"
          style={{
            display: "inline",
            color: "#000",
            marginTop: "0",
            
            marginBottom: "0",
          }}
        >
          Municipal Corporation Rohtak
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
