import { AuthProvider } from './context/AuthContext';
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Routers from "./routes/Routers.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  // Hide navbar and footer on signin/signup pages
  const hideNavbarFooter = ['/signin', '/Signup', '/signup', '/Signin','/forgot-password','/','/ownerhome','/ownerSignup','/login','/turfregistration'].includes(location.pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar/>}
      <main className="min-h-screen w-full">
        <AuthProvider>
      <Routers />
    </AuthProvider>
      </main>
      {!hideNavbarFooter && <Footer/>}
    </>
  );
}

export default App;