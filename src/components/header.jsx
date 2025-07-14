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


    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="inline justify-between items-center px-4 py-2">
        <img
          src="/images/HaryanaGov.jpg" // replace with actual path
          alt="Haryana Emblem"
          style={{display: "inline", marginRight: "16px", height: "80px", maxWidth: "10%"}}
          className="h-10"
        />
        <h1 className="text-xl font-bold text-gray-800" style={{display: "inline", marginRight: "20px", color: "#000", height: "80",
          maxWidth: "80%"}}>

          Municipal Corporation Rohtak
        </h1>
        <img
          src="/images/HaryanaGov.jpg" // replace with actual path
          alt="Azadi ka Amrit Mahotsav"
          className="h-10"
          style={{display: "inline", marginRight: "16px", height: "80px", maxWidth: "10%"}}

        />
      </div>
    </header>
  );
}
