import Image from "next/image"
import { InitialScrollReset } from "./_components/initial-scroll-reset"
import { StarCursor } from "./_components/star-cursor"
import { TwistedPrism } from "./_components/twisted-prism"

export default function Home() {
  const techStack = [
    "Java",
    "Python",
    "C#",
    "JavaScript",
    "TypeScript",
    "SQL",
    "React",
    "Angular",
    "Blazor",
    ".NET",
    "Docker",
    "AWS",
    "MATLAB",
    "Syncfusion",
    "Tailwind",
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <InitialScrollReset />
      <StarCursor />
      <div className="fixed inset-0 z-0 bg-black">
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen mx-4 my-8 md:mx-12 md:my-12 lg:mx-24 lg:my-16">
        <div className="bg-black border-2 border-primary/50 rounded-lg shadow-2xl overflow-hidden">
          <div className="border-b-2 border-primary/30 bg-card py-3 overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap w-max">
              {Array.from({ length: 12 }).flatMap((_, repeatIndex) =>
                techStack.map((tech, techIndex) => (
                  <span
                    key={`${repeatIndex}-${techIndex}-${tech}`}
                    className="inline-flex items-center px-6 text-sm font-mono text-primary/70"
                  >
                    <span className="mr-2 text-primary">$</span>
                    {tech}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-b border-primary/20 px-6 py-4 bg-card/50">
            <div className="flex gap-6 text-sm font-mono">
              <a href="#about" className="text-primary hover:text-foreground transition-colors">
                <span className="text-muted-foreground mr-1">$</span>about
              </a>
              <a href="#projects" className="text-primary hover:text-foreground transition-colors">
                <span className="text-muted-foreground mr-1">$</span>projects
              </a>
            </div>
          </nav>

          {/* Hero Section with Three.js Prism */}
          <div className="px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none">
            <TwistedPrism />
            </div>

            <p className="text-lg text-primary/80 font-mono mt-8 mb-12 text-center">
              Welcome to my website!
            </p>

            {/* About Section */}
            <section id="about" className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-5 font-mono">
                <span className="text-primary mr-2">{">"}</span>
                ABOUT_ME
              </h2>

              <div className="text-muted-foreground font-mono text-sm leading-relaxed">
                <div className="mb-6 md:float-left md:mr-8 md:mb-4 md:w-[min(32vw,22rem)]">
                  <div className="border-2 border-primary/30 rounded overflow-hidden bg-card/80">
                    <Image
                      src="/PicOfMe.png"
                      alt="Grace Gillam"
                      width={2048}
                      height={1853}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p>
                    I am a junior-level full-stack software developer, currently employed at a contractor where I&apos;ve been able to
                    get my hands dirty with many different frameworks and tech stacks. I graduated from Virginia Commonwealth University in
                    Spring 2025 with a B.S. in Computer Science, but during my time there I had the opportunity to engage in many great career-building
                    experiences. I also danced with the idea of pursuing chemical engineering, but code was simply much more fun to deal with. You can
                    check out my projects to see more of what I&apos;ve done, both in school and beyond! I also have a few fun apps in the pipeline,
                    so stay tuned for all to come.
                  </p>

                  <p>
                    Outside of coding what do I do? I climb, I read, I hike, I fish, I learn new things. I&apos;ve recently taken up carpentry and
                    will be taking up marine fishkeeping and greenhouse gardening when the time is right. Overall, I just like to build things! Digital, physical, it&apos;s
                    all the same to me - it&apos;s fun to put in the work and create something rewarding!
                  </p>
                </div>
              </div>

              <div className="clear-both mt-8 mb-12 flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.linkedin.com/in/grace-gillam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/50 text-primary font-mono text-sm hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span>LINKEDIN</span>
                </a>
                <a
                  href="https://github.com/gillamga"
                  target="_blank"
                  rel="noopener nonreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/50 text-primary font-mono text-sm hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span>GITHUB</span>
                </a>
                <a
                  href="/Grace Gillam April 2026 Resume.pdf"
                  download
                  className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/50 text-primary font-mono text-sm hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span>DOWNLOAD RESUME</span>
                </a>
                <a
                  href="mailto:grace.gillam@proton.me"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border-2 border-primary text-primary font-mono text-sm hover:bg-primary hover:text-background transition-all animate-glow-pulse"
                >
                  <span>GET IN TOUCH</span>
                </a>
              </div>
            </section>

            <section id="projects" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-mono">
                <span className="text-primary mr-2">{">"}</span>
                PROJECTS
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Portfolio Website */}
                <div className="border-2 border-primary/30 p-6 hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground font-mono">Portfolio Website</h3>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors"
                    >
                    </a>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Personal portfolio website showcasing my projects and experience. Built with modern web technologies
                    and featuring interactive 3D elements.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Three.js", "Tailwind CSS"].map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs border border-primary/20 text-primary/70 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Professor's Website */}
                <div className="border-2 border-primary/30 p-6 hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground font-mono">Living Lab Website for VCU</h3>
                    <a
                      href="https://github.com/gillamga/VCU-Living-Lab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors"
                    >
                    </a>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Professional website created for a VCU professor. Features clean design, responsive layout, and easy
                    content management.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "JavaScript", "CSS", "Responsive Design"].map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs border border-primary/20 text-primary/70 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Upcoming Projects */}
                <div className="border-2 border-primary/30 p-6 opacity-60">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground font-mono">Typewar II</h3>
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary font-mono">IN DEVELOPMENT</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    This will be a modernized homage to a game I enjoyed. It was created in the adolescence of the internet and finally met its end two years ago. More details coming soon!
                  </p>
                </div>        
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t-2 border-primary/20 pt-8 text-center">
              <p className="text-muted-foreground text-sm font-mono">
                <span className="text-primary">{"> "}</span>
                Built with Next.js, Three.js, and Tailwind CSS
              </p>
              <p className="text-muted-foreground text-xs font-mono mt-2">© 2025 Grace Gillam. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
