"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { clickSfx } from "../utils/clickSfx"
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        clickSfx.play();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        clickSfx.play();
        logout();
        navigate('/login');
    };

    const menuItems = ["Home", "Game", "Leaderboard", "About"];

    return (
        <div className="fixed top-0 left-0 w-full flex justify-center py-3 sm:py-6 z-50">
            <nav className="relative w-[95%] sm:w-[60%] max-w-[800px] rounded-full border-2 border-white/20 dark:bg-black dark:border-white/30 bg-black shadow-lg flex justify-center items-center px-3 sm:px-10 py-2 sm:py-4">
                {/* Mobile menu button */}
                <button 
                    className="absolute right-3 sm:hidden text-white p-2 transition-transform duration-200 hover:scale-110"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg 
                        className="w-5 h-5 sm:w-6 sm:h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        {isMenuOpen ? (
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>

                {/* Desktop menu */}
                <ul className="hidden sm:flex justify-center items-center w-full max-w-[500px] gap-8">
                    {menuItems.map((item) => (
                        <motion.p
                            key={item}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="cursor-pointer text-base sm:text-lg font-medium text-white hover:opacity-90 dark:text-white"
                        >
                            <Link to={`/${item.toLowerCase()}`} onClick={() => clickSfx.play()}>
                                {item}
                            </Link>
                        </motion.p>
                    ))}
                    {isAuthenticated ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleLogout}
                            className="cursor-pointer text-base sm:text-lg font-medium text-white hover:opacity-90 dark:text-white"
                        >
                            Logout
                        </motion.button>
                    ) : (
                        <motion.p
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="cursor-pointer text-base sm:text-lg font-medium text-white hover:opacity-90 dark:text-white"
                        >
                            <Link to="/login" onClick={() => clickSfx.play()}>
                                Login
                            </Link>
                        </motion.p>
                    )}
                </ul>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 left-0 w-full bg-black rounded-full border-2 border-white/20 py-14 px-4 sm:hidden"
                    >
                        <ul className="flex flex-col items-center gap-4">
                            {menuItems.map((item) => (
                                <motion.p
                                    key={item}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="cursor-pointer text-base font-medium text-white hover:opacity-90 dark:text-white"
                                >
                                    <Link 
                                        to={`/${item.toLowerCase()}`} 
                                        onClick={() => {
                                            clickSfx.play();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        {item}
                                    </Link>
                                </motion.p>
                            ))}
                            {isAuthenticated ? (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="cursor-pointer text-base font-medium text-white hover:opacity-90 dark:text-white"
                                >
                                    Logout
                                </motion.button>
                            ) : (
                                <motion.p
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="cursor-pointer text-base font-medium text-white hover:opacity-90 dark:text-white"
                                >
                                    <Link 
                                        to="/login" 
                                        onClick={() => {
                                            clickSfx.play();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Login
                                    </Link>
                                </motion.p>
                            )}
                        </ul>
                    </motion.div>
                )}
            </nav>
        </div>
    )
}

export default Navbar