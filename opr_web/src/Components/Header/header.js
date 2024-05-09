import './header.css';
import { Link } from "react-router-dom";


function Header() {
  return (

          <header className="header bg-indigo-500">
          <img src='' alt="Company Logo" className="logo" />
           {/* <li className='list-none'><Link to="/dashboard">Home </Link></li>
          <li className='list-none'>About</li>
          <li className='list-none'>Bank Lineage</li>
          <li className='list-none'><Link to="/">Login </Link></li>  */}
      </header>
   
  );
}
export default Header;
