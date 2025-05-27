
import { Link } from "react-router-dom";
import { Shield, Users, Award, Zap } from "lucide-react";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl mb-6">About ArogyaBite</h1>
            <p className="text-xl text-gray-600 mb-8">
              Empowering people with intelligent allergen detection for safer, smarter food decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading
              title="Our Journey"
              subtitle="How ArogyaBite became your food safety companion"
              centered={true}
            />
            <div className="space-y-4 text-gray-600">
              <p>
                ArogyaBite began with a simple yet meaningful goal — to make allergen detection accessible and reliable for everyone, using the power of AI. As part of our B.Tech minor project, we set out to solve a real-world problem that affects millions.
              </p>
              <p>
                Rather than staying theoretical, we built a practical tool that uses OCR and machine learning to scan food labels and detect hidden allergens in real time. Our platform reflects both our technical skills and our empathy toward individuals navigating food allergies.
              </p>
              <p>
                We believe food transparency should be a right, not a luxury. ArogyaBite empowers users — from individuals and families to healthcare professionals — to instantly assess if a food item aligns with their health needs.
              </p>
              <p>
                Today, ArogyaBite stands as a student-driven innovation designed to promote safer, smarter eating choices for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container-custom">
          <SectionHeading
            title="Our Mission"
            subtitle="To create a world where every bite is safe"
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Protect Health</h3>
              <p className="text-gray-600">
                We help prevent allergic reactions by alerting users to potential food risks before consumption.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Empower People</h3>
              <p className="text-gray-600">
                Our AI gives individuals control over their food safety with real-time insights tailored to their health profile.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovate with AI</h3>
              <p className="text-gray-600">
                We constantly enhance our AI with better allergen prediction and smarter food scanning capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-emerald-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Safe Eating Movement</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Try ArogyaBite today and be part of a healthier, smarter, and safer food experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button variant="primary" className="bg-white text-emerald-600 hover:bg-gray-100">
                Try ArogyaBite Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-emerald-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
