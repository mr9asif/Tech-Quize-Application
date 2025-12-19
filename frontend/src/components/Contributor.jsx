import { Facebook, Github, Globe, Linkedin, Mail } from 'lucide-react';
import asif from '../assets/asif.jpg';
import raj from '../assets/raj.jpg';

const Contributor = () => {
  const contributors = [
    {
      name: "mr9asif",
      role: "Lead Backend Architect & DevOps",
      contribution: "Architected the backend ecosystem, from database design and API development to final server deployment and optimization.",
      image: asif,
      socials: {
        github: "https://github.com/mr9asif",
        linkedin: "https://linkedin.com/in/mr9asif",
        email: "mailto:asifalibd002@gmail.com" // Added mailto: for functionality
      }
    },
    {
      name: "owarasurrahman",
      role: "Frontend Developer & UI Designer",
      contribution: "Crafted the responsive UI and animations while managing state logic. Integrated data fetching to sync the interface with backend services.",
      image: raj,
      socials: {
        github: "https://github.com/Coder7Raj",
        linkedin: "https://www.linkedin.com/in/owarasurrahman/",
        facebook: "https://www.facebook.com/owarasur.rahman.raj.2024"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Meet the Team</h2>
        <p className="text-center text-gray-600 mb-12">The brilliant minds behind Tech Quize Master.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {contributors.map((person, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 mb-4 shadow-md">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
              <p className="text-indigo-600 font-semibold mb-3 uppercase tracking-wide text-xs">{person.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {person.contribution}
              </p>

              {/* Social Links */}
              <div className="flex gap-5 mt-auto">
                {person.socials.github && (
                  <a href={person.socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                    <Github size={22} />
                  </a>
                )}
                {person.socials.linkedin && (
                  <a href={person.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin size={22} />
                  </a>
                )}
                {person.socials.facebook && (
                  <a href={person.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                    <Facebook size={22} />
                  </a>
                )}
                {person.socials.email && (
                  <a href={person.socials.email} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Mail size={22} />
                  </a>
                )}
                {person.socials.portfolio && (
                  <a href={person.socials.portfolio} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                    <Globe size={22} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributor;