// App.js
import About from "./components/about";
import Blogs from "./components/blogs";
import Category from "./components/category";
import Footer from "./components/footer";
import Header from "./components/header";
import Navbar from "./components/navbar";
import Products from "./components/products";
import Section from "./components/section"; // import Section

const App = () => {
  return (
    <>
      <Navbar />
      <Section>
        <Header />
        <About />
        <Category />
        <Products />
        <Blogs />
      </Section>
      <Footer />
    </>
  );
};

export default App;