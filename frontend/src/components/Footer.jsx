const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} SmartMess. Made with ☕ and ❤️ by Nihal Rawat.
        </p>
      </div>
    </footer>
  );
};

export default Footer;