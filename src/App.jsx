// App.js
import About from "./components/about";
import Blogs from "./components/blogs";
import Category from "./components/category";
import Footer from "./components/footer";
import Header from "./components/header";
import Navbar from "./components/navbar";
import Products from "./components/products";
import ZoomWrapper from "./ZoomWrapper";

const App = () => {
  return (
    <>
      <Navbar />
      <Header />
      <ZoomWrapper>
        <About />
        <Category />
        <Products />
        <Blogs />
      </ZoomWrapper>
      <Footer />
    </>
  );
};

export default App;