import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="h-full">
      <ToastContainer />
      <Header />
      <Input />
      <Footer />
    </div>
  );
}
