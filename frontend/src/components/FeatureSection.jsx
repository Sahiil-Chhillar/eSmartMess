import React from "react";

const features = [
  {
    title: "Attendance Tracking",
    description:
      "Keep an accurate daily record of your mess attendance without the hassle. No more manual logs—just easy tracking, every day.",
  },
  {
    title: "Bill Payment",
    description:
      "Pay your mess bills smoothly and securely online. Skip the lines and keep a clear history of your transactions with just a click.",
  },
  {
    title: "Menu Updates",
    description:
      "Get real-time updates on what’s being served in the mess. Plan your meals ahead with ease and stay informed daily.",
  },
  {
    title: "Complaints & Feedback",
    description:
      "Raise issues or give feedback instantly. Make your voice heard and help improve the mess experience for everyone around you.",
  },
  {
    title: "Notices & Announcements",
    description:
      "Stay updated with important mess announcements—special meals, closures, or rule changes—all delivered directly to your dashboard.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white" id="features">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10">Why Join SmartMess</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md transition duration-200 text-left flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-md text-gray-600 mb-4">
                  {feature.description}
                </p>
              </div>
              <a
                href="#"
                className="inline-block mt-2 text-md text-blue-600 hover:underline font-medium"
              >
                Explore Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
