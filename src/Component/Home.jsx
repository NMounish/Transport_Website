import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBus, FaMapMarkedAlt, FaHeadset, FaMoneyBillWave } from "react-icons/fa";
import Profile from "../assets/Profile.jpg";
import slider1 from "../assets/Slider1.jpeg";
import slider2 from "../assets/Slider2.jpg";
import slider3 from "../assets/Slider3.jpg";
import icon1 from "../assets/Icon1.png";
import icon2 from "../assets/Icon2.png";
import icon3 from "../assets/Icon3.png";
import icon4 from "../assets/Icon4.png";
import icon5 from "../assets/Icon5.png";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar3 from "../assets/avatar3.jpg";
import { Quote, User } from "lucide-react";
import { Megaphone } from "lucide-react"; // Icon Library
import { ChevronDown } from "lucide-react";
import { X } from "lucide-react";
import memories1 from "../assets/memories1.jpg";
import memories2 from "../assets/memories2.jpg";
import memories3 from "../assets/memories3.jpg";
import memories4 from "../assets/memories4.jpg";
import popular1 from "../assets/popular1.png";
import popular2 from "../assets/popular2.jpg";
import popular3 from "../assets/popular3.jpg"; 
import CountUp from "react-countup";


const Home = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [startingCity, setStartingCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [slider1, slider2, slider3, slider1, slider1];
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const contactRef = useRef(null);


  // Create a reference for the About section
  const aboutRef = useRef(null);

  const handleSearch = () => {
    if (!startingCity || !destinationCity) {
      alert("Please select both cities.");
      return;
    }
    navigate(`/routes?from=${startingCity}&to=${destinationCity}`);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

 const scrollToSection = (ref) => {
  if (ref && ref.current) {
    const offset = 80; // Adjust this value based on your navbar height
    const elementPosition = ref.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

  const services = [
    {
      id: 'luxury-travel',
      icon: <FaBus className="text-blue-500 text-4xl" />,
      title: "Luxury Travel",
      description: "Experience premium travel with comfortable seating & top-notch service.",
    },
    {
      id: 'custom-routes',
      icon: <FaMapMarkedAlt className="text-green-500 text-4xl" />,
      title: "Custom Routes",
      description: "Plan your own route with flexible scheduling & stops.",
    },
    {
      id: 'customer-support',
      icon: <FaHeadset className="text-purple-500 text-4xl" />,
      title: "24/7 Support",
      description: "Our support team is available around the clock for assistance.",
    },
    {
      id: 'affordable-pricing',
      icon: <FaMoneyBillWave className="text-yellow-500 text-4xl" />,
      title: "Affordable Pricing",
      description: "Enjoy top services at the best market prices with no hidden fees.",
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      feedback: "Amazing service! Exceeded my expectations.",
      role: "Traveller",
      avatar: avatar1,
    },
    {
      name: "Jane Smith",
      feedback: "Highly professional and Loveful journey!.",
      role: "YouTuber",
      avatar: avatar2,
    },
    {
      name: "Michael Lee",
      feedback: "Reliable and fast service. Safety!",
      role: "Social Media Specialist",
      avatar: avatar3,
    }
  ];

  const updates = [
    {
      title: "New Feature Released 🚀",
      date: "March 10, 2025",
      description: "We've launched a new dashboard with AI-powered insights.",
      link: "/updates/new-feature",
    },
    {
      title: "Website Redesign 🎨",
      date: "February 25, 2025",
      description: "Our website has a fresh new look! Check out the updates.",
      link: "/updates/redesign",
    },
    {
      title: "We're Hiring! 💼",
      date: "February 15, 2025",
      description: "Join our team and work on exciting projects with us!",
      link: "/careers",
    },
  ];

  const faqs = [
    { question: "What are the popular destinations?", answer: "We offer trips to Goa, Manali, Kerala, and more!" },
    { question: "Do you offer customizable tour packages?", answer: "Yes! You can customize your itinerary as per your preference." },
    { question: "What payment methods do you accept?", answer: "We accept credit/debit cards, UPI, and net banking." },
    { question: "Is travel insurance included?", answer: "We provide optional travel insurance for your safety." },
  ];

  const images = [
    memories1,
    memories2,
    memories3,
    memories4,
  ];

  const packages = [
    {
      title: "Weekend Getaway to Goa",
      price: "₹8,499",
      discount: "20% off",
      description: "Enjoy a relaxing weekend at the beaches of Goa.",
      image: popular1,
    },
    {
      title: "Adventure in Manali",
      price: "₹12,999",
      discount: "15% off",
      description: "Experience thrilling activities in the Himalayas.",
      image: popular2,
    },
    {
      title: "Cultural Tour of Kerala",
      price: "₹10,999",
      discount: "10% off",
      description: "Explore the backwaters and rich culture of Kerala.",
      image: popular3,
    },
  ];

  const StatCard = ({ icon, endVal, description }) => {
    return (
      <div className=" bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-5xl font-bold text-white mb-2">
          <CountUp start={0} end={endVal} duration={3} delay={0.5} />+
        </h3>
        <p className="text-gray-200">{description}</p>
      </div>
    );
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-gray-200 shadow-md">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <span className="text-2xl font-bold">REGAL ROAMERS</span>
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-8 font-medium">
              <li>
                <a
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-blue-700 cursor-pointer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-gray-900 hover:text-blue-700 cursor-pointer"
                >
                  About
                </a>
              </li>
              <li className="relative group">
          <button className="flex items-center text-gray-900 hover:text-blue-700">
            Services
            <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                         transition-all duration-300">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(service.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {service.title}
              </a>
            ))}
          </div>
        </li>
              <li>
                <a href="#contact" className="text-gray-900 hover:text-blue-700 cursor-pointer"
                onClick={(e) => {
      e.preventDefault();
      scrollToSection(contactRef);
    }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                src={Profile}
                className="w-8 h-8 rounded-full"
                alt="Profile"
              />
            </button>
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        </div>

        {dropdownOpen && (
          <div className="absolute right-4 mt-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm z-50">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">
                {user?.fname || "Guest"}
              </span>
              <span className="block text-sm text-gray-500 truncate">
                {user?.email || "Not available"}
              </span>
            </div>
            <ul className="py-2">
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
  <ul className="flex flex-col font-medium p-4 border border-gray-100 rounded-lg bg-gray-50">
    <li>
      <a
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="block py-2 px-3 text-blue-700 cursor-pointer"
      >
        Home
      </a>
    </li>
    <li>
      <a
        onClick={() => scrollToSection(aboutRef)}
        className="block py-2 px-3 text-gray-900 hover:bg-gray-100 cursor-pointer"
      >
        About
      </a>
    </li>
    
    {/* Mobile Services Dropdown */}
    <li>
      <button 
        onClick={() => setServicesOpen(!servicesOpen)}
        className="flex justify-between items-center w-full py-2 px-3 text-gray-900 hover:bg-gray-100"
      >
        Services
        <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
      </button>
      
      {servicesOpen && (
        <ul className="pl-4">
          {services.map(service => (
            <li key={service.id}>
              <a
                href={`#${service.id}`}
                className="block py-2 px-3 text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(service.id)?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
              >
                {service.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
    <li>
  <a
    href="#contact"
    className="text-gray-900 hover:text-blue-700"
    onClick={(e) => {
      e.preventDefault();
      scrollToSection(contactRef);
      setMobileMenuOpen(false);
    }}
  >
    Contact
  </a>
</li>
  </ul>
</div>

      </nav>

      <div id="indicators-carousel" className="relative w-full">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              data-carousel-item={index === activeSlide ? "active" : ""}
            >
              <img
                src={slide}
                className="block w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                index === activeSlide ? "bg-blue-700" : "bg-gray-300"
              }`}
              aria-current={index === activeSlide}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
            ></button>
          ))}
        </div>

        {/* Previous and Next Buttons */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={() =>
            setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-6 bg-white shadow-lg rounded-lg">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            Starting City
          </label>
          <select
            value={startingCity}
            onChange={(e) => setStartingCity(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select City</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
          </select>
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            Destination City
          </label>
          <select
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select City</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <div className="text-center text-2xl p-5 font-semibold">
        <h2>OUR AMENITIES</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-10 md:gap-40 p-5">
        <div className="flex flex-col items-center w-28">
          <img src={icon1} alt="Snacks" className="w-20 h-20 md:w-24 md:h-24" />
          <p className="mt-2 text-lg text-center">Snacks</p>
        </div>
        <div className="flex flex-col items-center w-28">
          <img
            src={icon2}
            alt="Tracking"
            className="w-20 h-20 md:w-24 md:h-24"
          />
          <p className="mt-2 text-lg text-center">Tracking</p>
        </div>
        <div className="flex flex-col items-center w-28">
          <img
            src={icon3}
            alt="Charging Point"
            className="w-20 h-20 md:w-24 md:h-24"
          />
          <p className="mt-2 text-lg text-center">Charging Point</p>
        </div>
        <div className="flex flex-col items-center w-28">
          <img
            src={icon4}
            alt="Reading Light"
            className="w-20 h-20 md:w-24 md:h-24"
          />
          <p className="mt-2 text-lg text-center">Reading Light</p>
        </div>
        <div className="flex flex-col items-center w-28">
          <img
            src={icon5}
            alt="Exciting Offers"
            className="w-20 h-20 md:w-24 md:h-24"
          />
          <p className="mt-2 text-lg text-center">Exciting Offers</p>
        </div>
      </div>

      <section ref={aboutRef} className="bg-gray-100 py-16">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-blue-700 md:text-4xl">
      Who We Are
    </h2>
    <p className="text-gray-700 mt-4 text-lg leading-relaxed">
      At <span className="font-semibold">Regal Roamers</span>, we redefine travel with seamless journeys, premium services, and unforgettable experiences. 
      Whether you're commuting or exploring new destinations, we ensure a comfortable and safe ride.
    </p>
  </div>
</section>

<section id="services" className="py-16 bg-gray-50">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
    <p className="text-gray-600 mt-3">We provide the best travel solutions tailored to your needs.</p>

    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={index}
          id={service.id}  // Add ID here
          className="p-6 bg-white rounded-xl shadow-lg text-center transform hover:scale-105 transition-all"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="flex justify-center mb-4">{service.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
          <p className="text-gray-600 mt-2">{service.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
    <section className="py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">What Our Clients Say</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="p-6 max-w-sm bg-white rounded-xl shadow-lg relative transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {/* Quote Icon */}
            <Quote className="absolute top-4 right-4 text-gray-300 w-8 h-8" />

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              {testimonial.avatar ? (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <User className="w-12 h-12 text-gray-500" />
              )}
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700">"{testimonial.feedback}"</p>
          </motion.div>
        ))}
      </div>
    </section>
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE - Updates List */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Recent Updates</h2>
          <div className="border-l-4 border-blue-500 pl-6 space-y-6">
            {updates.map((update, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 10 }}
                className="group transition-all cursor-pointer"
              >
                <p className="text-gray-500 text-sm">{update.date}</p>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-all">
                  {update.title}
                </h3>
                <p className="text-gray-600">{update.description}</p>
                <a href={update.link} className="text-blue-600 font-medium text-sm inline-block mt-2">
                  Read More →
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Large Icon or Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          {/* ICON - You can replace this with an image */}
          <Megaphone className="text-blue-500 w-48 h-48 md:w-56 md:h-56" />
        </motion.div>
      </div>
    </section>

    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-gray-800"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <ChevronDown className={`w-6 h-6 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">🌍 Travel Memories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Travel ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-lg">
            <X className="absolute top-4 right-4 text-white cursor-pointer w-6 h-6" onClick={() => setSelectedImage(null)} />
            <img src={selectedImage} alt="Selected Travel" className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </section>

    <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">✨ Exclusive Travel Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className=" z-10 group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                {/* Image */}
                <img src={pkg.image} alt={pkg.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />

                {/* Title Overlay */}
                <div className="absolute top-4 left-4  bg-opacity-50 text-blue-900 px-3 py-1 rounded-md text-lg font-bold">
                  {pkg.title}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-4 text-white">
                  <p className="text-sm opacity-80">{pkg.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-semibold">{pkg.price}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">{pkg.discount}</span>
                  </div>
                  <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Top Destinations</h2>
    <p className="text-gray-600 mb-12">Discover the most sought-after travel destinations with us.</p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Destination 1 */}
      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={popular1} // Replace with your image
          alt="Goa"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Goa</h3>
          <p className="text-gray-200">Relax on pristine beaches and enjoy vibrant nightlife.</p>
          <button className="mt-4 w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition">
            Explore
          </button>
        </div>
      </motion.div>

      {/* Destination 2 */}
      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src={popular2} // Replace with your image
          alt="Manali"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Manali</h3>
          <p className="text-gray-200">Experience adventure in the heart of the Himalayas.</p>
          <button className="mt-4 w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition">
            Explore
          </button>
        </div>
      </motion.div>

      {/* Destination 3 */}
      <motion.div
        className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <img
          src={popular3} // Replace with your image
          alt="Kerala"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Kerala</h3>
          <p className="text-gray-200">Explore serene backwaters and lush greenery.</p>
          <button className="mt-4 w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition">
            Explore
          </button>
        </div>
      </motion.div>
    </div>
  </div>
</section>
<section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Our Journey in Numbers</h2>
        <p className="text-gray-200 mb-12">Discover the impact we've made in the travel industry.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard
            icon={<FaBus className="text-black text-4xl" />}
            endVal={50000}
            description="Happy Travelers"
          />
          <StatCard
            icon={<FaMapMarkedAlt className="text-black text-4xl" />}
            endVal={150}
            description="Destinations Covered"
          />
          <StatCard
            icon={<FaHeadset className="text-black text-4xl" />}
            endVal={24}
            description="Customer Support"
          />
          <StatCard
            icon={<FaMoneyBillWave className="text-black text-4xl" />}
            endVal={95}
            description="Customer Satisfaction"
          />
        </div>
      </div>
    </section>

    {/* Add this section at the end of your component, before the closing </div> */}
<section id="contact" ref={contactRef} className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Contact Form */}
      <div className="bg-gray-50 p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+91 9876543210"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
      
      {/* Contact Info & Map */}
      <div className="space-y-8">
        <div className="bg-gray-50 p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Our Information</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-700">123 Travel Street, City Center</p>
                <p className="text-gray-700">Chennai, Tamil Nadu 600001</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-700">+91 9876543210</p>
                <p className="text-gray-700">Mon-Fri, 9am-6pm</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-700">info@regalroamers.com</p>
                <p className="text-gray-700">support@regalroamers.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Embed */}
        <div className="h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.005234742895!2d80.23101531482193!3d12.971962990856227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d6c6e7d33b1%3A0x4e3012937a1e0b9a!2sChennai%20Central!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Our Location"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>

    
    
  );
};

export default Home;