import heroImg from "../assets/heroImg.png";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="relative">
            <img
                src={heroImg}
                alt="SmartMess"
                className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
                <div className="text-center text-white p-6">
                    <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
                        Smart Simple<br /> Served.


                    </h1>
                    <p className="text-sm tracking-tighter md:text-lg mb-6 max-w-2xl mx-auto text-centeR">
                        Say goodbye to long queues, messy records, and confusing menus. SmartMess brings you a seamless way to manage your hostel dining – from raising concerns to tracking meals, marking attendance to paying bills. One platform, total control.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
                    >
                        Join Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
