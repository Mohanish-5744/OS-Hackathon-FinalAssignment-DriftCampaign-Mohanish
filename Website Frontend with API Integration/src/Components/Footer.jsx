import React from "react";
// import './footer.css';
import './footer.css';
// import mohanishprofile from '../assets/mohanish.png'
import mohanishprofile from './mohanish.png'
import shrutikaprofile from './shrutika.png'
import shrutiprofile from './shruti.png'
import { FaLinkedin, FaInstagram, FaWhatsapp, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const teamMembers = [
    {
      name: "Mohanish Khambadkar",
      email: "mohanishkhambadkar@gmail.com",
      contact: "+91-9403904623",
      profileImage: mohanishprofile,
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/mak9582/",
        instagram: "https://instagram.com/mohanish_5744/",
        whatsapp: "https://wa.me/917822941461",
        github: "https://github.com/Mohanish-5744",
        email: "mailto:mohanishkhambadkar@gmail.com",
      },
    },
    {
      name: "Shrutika Jadhav",
      email: "shrutikajadhav2611@gmail.com",
      contact: "+91-8788721430",
      profileImage: shrutikaprofile,
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/theshrutikajadhav/",
        instagram: "https://instagram.com/shrutikaa_5/",
        whatsapp: "https://wa.me/918788721430",
        github: "https://github.com/Shrutikaa5",
        email: "mailto:shrutikajadhav2611@gmail.com",
      },
    },
    {
      name: "Shruti Dhumal",
      email: "dhumalshruti5@gmail.com",
      contact: "+91-9422560803",
      profileImage: shrutiprofile,
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/shruti-dhumal-954028266/",
        instagram: "https://instagram.com/shruti_dhumal09/",
        whatsapp: "https://wa.me/919422560803",
        github: "https://github.com/Shruti2003D",
        email: "mailto:dhumalshruti5@gmail.com",
      },
    },
  ];

  return (
    <footer className="footer">
      <div className="header">
        <h1>Meet Our Team !</h1>
      </div>
      <div className="footer-container">
        {teamMembers.map((member, index) => (
         <div key={index} className="team-member">
         <img 
           src={member.profileImage} 
           alt={`${member.name}'s profile`} 
           className="profile-image" 
         />
         <div className="member-info">
           <h3>{member.name}</h3>
           <p>{member.email}</p>
           <p>{member.contact}</p>
           <div className="social-links">
             <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
               <FaLinkedin />
             </a>
             <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
               <FaInstagram />
             </a>
             <a href={member.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
               <FaWhatsapp />
             </a>
             <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
               <FaGithub />
             </a>
             <a href={member.socialLinks.email}>
               <FaEnvelope />
             </a>
           </div>
         </div>
       </div>
       
        ))}
      </div>
    </footer>
  );
};

export default Footer;
