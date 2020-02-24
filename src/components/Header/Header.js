import React from "react";
import './Header.css';

class Header extends React.Component {
    render() {
      return (
        <div className="headerWrapper">
          <div className="headerText">ABN Search tool</div>
        </div>
      );
    }
}

export default Header;