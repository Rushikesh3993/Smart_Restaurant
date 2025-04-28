import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";  // 👈 Import the chatbot
// import BotAvatar from "@/components/BotAvatar"; // 👈 Import the bot avatar
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen m-2 md:m-0">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>

      {/* Floating Components */}
      <Chatbot />
      {/* <BotAvatar /> 👈 Add avatar that floats and animates */}
    </div>
  );
};

export default MainLayout;
