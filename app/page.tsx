import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EventBand from "@/components/EventBand";
import Program from "@/components/Program";
import Agenda from "@/components/Agenda";
import Learn from "@/components/Learn";
import Scenarios from "@/components/Scenarios";
import Why from "@/components/Why";
import Audience from "@/components/Audience";
import Guests from "@/components/Guests";
import RegistrationForm from "@/components/RegistrationForm";
import RegistrationTeaser from "@/components/RegistrationTeaser";
import Consult from "@/components/Consult";
import Organizers from "@/components/Organizers";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="page">
        <Hero />
        <EventBand />
        <Program />
        <RegistrationTeaser />
        <Agenda />
        <Learn />
        <Scenarios />
        <Why />
        <Audience />
        <Guests />
        <RegistrationForm />
        <Consult />
        <Organizers />
        <Footer />
      </div>
    </>
  );
}
