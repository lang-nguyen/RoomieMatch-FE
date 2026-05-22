import Header from '../homepage/components/Header';
import Footer from '../homepage/components/Footer';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactSidePanel from './components/ContactSidePanel';
import {
  contactHeroStats,
  contactTopics,
  contactSupportInfo,
  contactFaq
} from './mockData';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Header initialActiveId="contact" />

      <ContactHero stats={contactHeroStats} />

      <main className="contact-main">
        <ContactForm topics={contactTopics} />
        <ContactSidePanel supportInfo={contactSupportInfo} faq={contactFaq} />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
