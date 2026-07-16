import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Routers from "./routes/Routers.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  // Hide navbar and footer on signin/signup pages
  const hideNavbarFooter = [
    "/signin",
    "/Signup",
    "/signup",
    "/Signin",
    "/forgot-password",
    "/",
    "/ownerhome",
    "/ownerSignup",
    "/login",
    "/turfregistration",
  ].includes(location.pathname);

  return (
    <ThemeProvider>
      {!hideNavbarFooter && <Navbar />}
      <main key={location.pathname} className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0A0F1D] text-slate-900 dark:text-slate-100 transition-colors duration-500 page-transition-active">
        <AuthProvider>
          <BookingProvider>
            <Routers />
          </BookingProvider>
        </AuthProvider>
      </main>
      {!hideNavbarFooter && <Footer />}
      <AIAssistant />
    </ThemeProvider>
  );
}

export default App;
