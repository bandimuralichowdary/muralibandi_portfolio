
import Hero from "./Hero";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import Navbar from "./Navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="scroll-container overflow-y-scroll scroll-smooth snap-y snap-mandatory h-screen overflow-x-hidden ">
                <div className="snap-start" id="hero"><Hero /></div>
                <div className="snap-start" id="projects"><Projects /></div>
                <div className="snap-start" id="skills"><Skills /></div>
                <div className="snap-start" id="contact"><Contact /></div>
            </div>
        </>
    );
}
