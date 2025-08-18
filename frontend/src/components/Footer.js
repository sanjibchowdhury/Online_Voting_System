import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#000080", color: "#fff", padding: "10px 0", textAlign: "center" }}>
      {/* <p>© sanjib chowdhury {new Date().getFullYear()} Online Voting System. All rights reserved.</p> */}
      <p>© Made by Sanjib Chowdhury {new Date().getFullYear()}</p>
    </footer>
  );
}
