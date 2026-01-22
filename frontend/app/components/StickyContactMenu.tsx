import { Box, IconButton, Tooltip } from "@mui/material";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface StickyContactMenuProps {
  darkMode: boolean;
  scrollToSection?: (elementId: string) => void;
}

export default function StickyContactMenu({ darkMode, scrollToSection }: StickyContactMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and responsive layout
  useEffect(() => {
    setIsHydrated(true);
    
    // Set initial mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show the menu only after user has scrolled down a bit
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render until hydrated to avoid mismatch
  if (!isHydrated) return null;
  if (!isVisible) return null;


  const contactLinks = [
    {
      icon: <FaGithub />,
      label: 'GitHub',
      href: 'https://github.com/johndoe',
      hoverColor: darkMode ? '#f0f6fc' : '#24292e',
    },
    {
      icon: <FaLinkedinIn />,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/johndoe',
      hoverColor: '#0a66c2',
    },
    {
      icon: <FaTwitter />,
      label: 'Twitter',
      href: 'https://twitter.com/johndoe',
      hoverColor: '#1da1f2',
    },
    {
      icon: <HiOutlineMail />,
      label: 'Email',
      href: 'mailto:john@example.com',
      hoverColor: '#ff006e',
      onClick: (e: React.MouseEvent) => {
        if (scrollToSection) {
          e.preventDefault();
          scrollToSection('contact');
        }
      },
    },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          position: 'fixed',
          left: isMobile ? 16 : 24,
          bottom: isMobile ? 24 : '50%',
          transform: isMobile ? 'translateY(0)' : 'translateY(50%)',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: 2,
          zIndex: 1000,
          backgroundColor: darkMode 
            ? 'rgba(13, 27, 42, 0.85)' 
            : 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: isMobile ? 8 : 16,
          borderRadius: isMobile ? 12 : 16,
          border: '1px solid',
          borderColor: darkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {contactLinks.map((link, index) => (
          <Tooltip key={index} title={link.label} placement={isMobile ? 'top' : 'right'}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                {...(link.onClick 
                  ? { onClick: link.onClick }
                  : { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                )}
                size="medium"
                sx={{
                  color: 'inherit',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: link.hoverColor,
                  },
                }}
              >
                {link.icon}
              </IconButton>
            </motion.div>
          </Tooltip>
        ))}
      </Box>
    </motion.div>
  );
}
