import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../shop/core/cart/CartContext';
import soochuhLabel from '../assets/images/soochuh-label-stitch.webp';
import saarahBaartmanHall from '../assets/images/SaarahBaartmanHallPIC.jpg';

const About: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About Us | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Learn about Soochuh's mission to revolutionize medical apparel with technical designs for technical professionals." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-10 text-black">
            About Us
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-6">Etymology</h2>
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-sm mb-6">
                <p className="text-zinc-800 leading-relaxed mb-4">
                  <strong className="text-black text-lg">Suture:</strong> Pronounced as <em>'soo-chuh'</em>.
                </p>
              </div>
              
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm mb-6">
                <p className="text-zinc-700 leading-relaxed italic">
                  "What are sutures? Sutures, also known as stitches, are sterile surgical threads used to repair cuts." - Google
                </p>
              </div>

              <p className="text-xl font-bold text-black leading-relaxed mb-8">
                A good suture (Soochuh) keeps bonds together forever.
              </p>

              <div className="flex justify-center my-8">
                <div className="max-w-2xl w-full h-64 overflow-hidden rounded-lg shadow-2xl border border-zinc-200">
                  <img 
                    src={soochuhLabel} 
                    alt="Soochuh fabric label stitch"
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: 'center center' }}
                  />
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-8">Soochuh Story</h2>
              
              <div className="space-y-6 text-zinc-700 leading-relaxed">
                <p>
                  It all started with a dental student, wearing her first set of boxy Smurf blue scrubs.
                </p>

                <p>
                  As most healthcare practitioners have become accustomed too, in South Africa, at least one year of community service is required in order to complete your healthcare professional qualification.
                </p>

                <p>
                  And after 5 years of studying dentistry, in the same boxy blue scrubs, it was finally time to shine, in any colour other than blue!
                </p>

                <p>
                  It was also then, that I realized the struggle of finding functionally comfortable, yet affordably flattering local brands to support, that also maintained stock on hand and were looking for sustainable approaches to the fast fashion crises.
                </p>

                <p>
                  Funny enough, in Cape Town during December's 'festive season,' it's almost impossible to find some things, such as accommodation or scrubs! "Commserve" was due to start in the first week of January. And I didn't have either. The accommodation story is one for another day.
                </p>

                <p>
                  With market options limited, I gathered my Pinterest ideas, headed to the nearest fabric store, and begged my dressmaker to turn my vision of scrubs into reality.
                </p>

                <p>
                  And just like that, without any pattern, the first two sets of SOOCHUH Scrubs were born, unknowingly at the time, and also in time for my first day as a Commserve dentist.
                </p>

                <p>
                  After numerous compliments on the aesthetic and feel of the scrubs, from co-workers and the likes, it wasn't too long after that the entire dental team was wearing my design. This was the "Kairotic" moment. The moment that made me realize, there could be more to this! After all the compliments, and requests for products from my family and friends, I had to pursue the need to fill a potential gap in the market. My design and vision for sustainable local functional fashion was in need and I had a purpose – to set up a business now formally known as SOOCHUH.
                </p>

                <p>
                  It was from hereon, that things got real.
                </p>

                <p>
                  I partnered up with my husband, formally registered the business, and threw caution to the wind.
                </p>

                <p>
                  After months of trials and error, discovering new things about an industry that is on our bodies daily, was daunting. Not knowing the difference between a pattern piece, pattern marker and a pattern maker. We managed to figure it out the best way we know how, together!
                </p>

                <p>
                  Still unsure as to whether it would sell, we kept our heads down and continued at the coal face. Persevering, learning from countless mistakes, but always learning & improving our design. Till eventually, we were happy with the design, found suitable fabrics, and quality-approved local manufacturers.
                </p>

                <p>
                  We are now happy to bring, SOOCHUH, to the healthcare community. Forming ideas into realities, celebrating designs for our health force. And looking out for the communities in need.
                </p>

                <p className="font-semibold text-black">
                  We take this opportunity to thank each and every single one that has assisted, participated, guided, motivated, criticized and cared for us through the journey.
                </p>

                <p className="text-center font-black text-2xl text-black mt-8 uppercase tracking-wider">
                  Soochuh
                </p>
              </div>
            </section>

            {/* Quote Section */}
            <section className="mt-20">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-10 md:p-16 rounded-lg shadow-lg border border-purple-100">
                <blockquote className="text-center">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-black leading-relaxed mb-8">
                    We don't know where we'll be in a week or in a month. We do what we want for as long as we want, always trying out new experiences.
                  </p>
                  <footer className="text-lg md:text-xl font-semibold text-purple-600">
                    — Nabeelah & Ameer —
                  </footer>
                </blockquote>
              </div>

              {/* Image */}
              <div className="mt-12 rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src={saarahBaartmanHall} 
                  alt="Saarah Baartman Hall"
                  className="w-full h-auto object-cover"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
