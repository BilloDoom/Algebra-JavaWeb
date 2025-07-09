import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../constants/index";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ScanFace } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../api/api";

function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const navRef = useRef(null);
    const trackerRef = useRef(null);

    const [profileImage, setProfileImage] = useState(null);
    const [username, setUsername] = useState("User");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("user");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const profileImage = localStorage.getItem("profileImage");

        setIsAuthenticated(!!token);
        setProfileImage(profileImage);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.name || decoded.sub || "User");
                const rawRole = decoded.role || "ROLE_USER";
                const normalizedRole = rawRole.replace("ROLE_", "").toLowerCase();
                setUserRole(normalizedRole || "user");
            } catch (err) {
                console.error("Invalid JWT:", err);
            }
        } else {
            setUsername("User");
            setUserRole("user");
        }
    }, [location]);

    // Logout
    const handleLogout = () => {
        logoutUser()
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
        localStorage.removeItem("profileImage");
        setIsAuthenticated(false);
        navigate("/login");
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Animate tracker to selected link
    const moveTracker = () => {
        const activeLink = navRef.current?.querySelector(".nav-link.selected");
        const tracker = trackerRef.current;

        if (activeLink && tracker && navRef.current) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = navRef.current.getBoundingClientRect();
            const padding = 6;

            tracker.style.top = `${linkRect.top - navRect.top - padding}px`;
            tracker.style.left = `${linkRect.left - navRect.left - padding}px`;
            tracker.style.width = `${linkRect.width + padding * 2}px`;
            tracker.style.height = `${linkRect.height + padding * 2}px`;
        }
    };

    useLayoutEffect(() => {
        moveTracker();
        window.addEventListener("resize", moveTracker);
        return () => window.removeEventListener("resize", moveTracker);
    }, [location]);

    useEffect(() => {
        const nav = navRef.current;

        const handleMouseMove = (e) => {
            const navLinks = navRef.current.querySelectorAll(".nav-link .nav-inner");

            navLinks.forEach((inner) => {
                const rect = inner.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

                const maxDistance = 300;

                if (distance < maxDistance) {
                    const t = 1 - distance / maxDistance;

                    const eased = easeInOutQuad(t);

                    const maxTilt = 10;
                    const rotateX = -deltaY / maxDistance * maxTilt * eased;
                    const rotateY = deltaX / maxDistance * maxTilt * eased;

                    inner.style.transform = `perspective(50px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                } else {
                    inner.style.transform = `perspective(50px) rotateX(0deg) rotateY(0deg)`;
                }
            });
        };

        const handleMouseLeave = () => {
            const navLinks = nav.querySelectorAll(".nav-link .nav-inner");
            navLinks.forEach((inner) => {
                inner.style.transform = `perspective(300px) rotateX(0deg) rotateY(0deg)`;
            });
        };

        nav.addEventListener("mousemove", handleMouseMove);
        nav.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            nav.removeEventListener("mousemove", handleMouseMove);
            nav.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div
            className={`navbar ${isExpanded ? "expanded" : ""}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
            <nav className="glass-nav" ref={navRef} style={{ position: "relative" }}>
                {/* <div className="nav-link-tracker" ref={trackerRef}></div> */}


                <ul className="nav-list">
                    {navLinks
                        .filter((item) => item.public || userRole === "admin")
                        .map((item, index) =>
                            item.separator ? (
                                <hr key={`separator-${index}`} className="nav-separator" />
                            ) : (
                                <li key={index}>
                                    <Link
                                        to={item.href}
                                        className={`nav-link ${location.pathname === item.href ? "selected" : ""}`}
                                    >
                                        <div className="nav-inner">
                                            {item.icon && <item.icon size={20} />}
                                            <span>{item.text}</span>
                                        </div>
                                    </Link>
                                </li>
                            )
                        )}
                </ul>
                <div ref={dropdownRef} className="nav-profile-container">
                    <hr className="nav-separator" />
                    <div style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                        {isAuthenticated ? (
                            <>
                                <div className="profile-display" onClick={toggleDropdown} title="Account">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="User Icon"
                                            className="profile-icon"
                                        />
                                    ) : (
                                        <div className="profile-icon">
                                            <ScanFace style={{ width: "100%", height: "100%" }} />
                                        </div>
                                    )}
                                    <div className="profile-backdrop"></div>
                                    <span className="profile-name">{username}</span> {/* Replace with actual username */}
                                </div>
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => navigate("/profile")} className="dropdown-item">
                                            Profile
                                        </button>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className="nav-link">
                                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: ".2rem .5rem" }}>
                                    Login
                                </div>
                            </Link>
                        )}
                    </div>
                    <hr className="nav-separator" />
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
