import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaMicrophone, FaTasks, FaStickyNote, FaBell, FaHome } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaMicrophone className="mic-icon" />
        <div className="logo-text-group">
          <div className="logo-text">Echo<span>Mind</span></div>
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaTasks /> Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/reminders" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaBell /> Reminders
          </NavLink>
        </li>
        <li>
          <NavLink to="/notes" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaStickyNote /> Notes
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
