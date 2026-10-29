import { FaStar } from "react-icons/fa";

const testimonials = [
    {
        name: "Shoyo",
        rating: 5,
        text: "SmartMess has made my hostel life way more convenient. Rebates, bills, and attendance—everything is a tap away!",
        image: "https://www.figma.com/community/resource/58b10bce-db29-4325-9d14-9984960f3739/thumbnail"
    },
    {
        name: "Admin",
        rating: 5,
        text: "Managing student complaints and menus used to be a hassle. SmartMess saves me hours every week!",
        image: "https://i.pravatar.cc/150?img=12"
    },
    {
        name: "Thorfinn",
        rating: 4,
        text: "I love the simple design and easy navigation. No more confusion with messy notices or meal records.",
        image: "https://i.pinimg.com/originals/34/22/2a/34222a8f0d41c9158729fe194a789268.jpg"
    },
];

const TestimonialsSection = () => {
    return (
        <section className="pt-12 pb-20 bg-gray-100">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-10">What Our Users Say</h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-white shadow-md rounded-lg p-6 text-left flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="flex items-center text-yellow-400 mb-1">
                                        {Array(t.rating)
                                            .fill(0)
                                            .map((_, i) => (
                                                <FaStar key={i} />
                                            ))}
                                    </div>
                                    <span className="text-lg font-semibold">{t.name}</span>
                                </div>
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-full object-cover ml-4 border"
                                />
                            </div>
                            <p className="text-gray-700 text-sm mt-2">“{t.text}”</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
