import axios from 'axios';
import { Award, BookOpen, Code, Coffee, Cpu, Database, Globe, Layout, Sparkles, Star, Target, Terminal, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { sidebarStyles } from "../assets/dummyStyles";
import questionsData from "../assets/dummydata.js";
const API_BASE = "http://localhost:4000";

const Sidebar = () => {
    const [selectedTech, setSelectedTech] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState({});
    const [showResults, setShowResults] = useState(false);

    const submittedRef = useRef(false);
    const [isSidebarOpen, setIsSidebarOpen]=useState(false);
    const asideRef = useRef(null);

    useEffect(()=>{
        const handleResize = ()=>{
            if(window.innerWidth >= 768) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    },[]);

    useEffect(()=>{
        if(window.innerWidth < 768){
            if(isSidebarOpen) document.body.style.overflow="hidden";
            else document.body.style.overflow="";
        }else{
            document.body.style.overflow="";
        }
        return ()=>{
            document.body.style.overflow="";
        };
    }, [isSidebarOpen]);

    // techs
      const technologies = [
        {
            id:'html',
            name:"HTML",
            icon:<Globe size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
        {
            id:"css",
            name:"CSS",
            icon:<Layout size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"js",
            name:"JavaScript",
            icon:<Code size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"react",
            name:"React",
            icon:<Cpu size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"node",
            name:"Node.Js",
            icon:<Code size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"mongodb",
            name:"MongoDB",
            icon:<Database size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"java",
            name:"Java",
            icon:<Coffee size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"python",
            name:"Python",
            icon:<Terminal size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"cpp",
            name:"C++",
            icon:<Code size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        },
          {
            id:"bootstrap",
            name:"Boostrap",
            icon:<Layout size={20} />,
            color:"bg-blue-50 text-orange-600 border-orange-200",
        }
      ];

      const levels = [
        {
            id:"basic",
            name:"Basic",
            questions:20,
            icon:<Star size={16} />,
            color:"bg-green-50 text-green-600",
        },
         {
            id:"intermediate",
            name:"Intermediate",
            questions:40,
            icon:<Zap size={16} />,
            color:"bg-green-50 text-green-600",
        },
         {
            id:"advance",
            name:"Advance",
            questions:60,
            icon:<Target size={16} />,
            color:"bg-green-50 text-green-600",
        }
      ];

    //   handle what you select tech
    const handleTechSelect = (techId) =>{
        if(selectedTech === techId){
            setSelectedTech(null);
            setSelectedLevel(null);
        }else{
            setSelectedTech(techId);
            setSelectedLevel(null)
        }
        setCurrentQuestion(0);
        setUserAnswer({});
        setShowResults(false);
        submittedRef.current=false;
        if(window.innerWidth < 768) setIsSidebarOpen(true);

        setTimeout(()=>{
            const el= asideRef.current?.querySelector(`[data-tech]="${techId}"`);
            if(el) el.scrollIntoView({behaviour:"smooth", block:"center"});
        }, 120)
    };

    const handleLevelSelect = (levelId)=>{
       setSelectedLevel(levelId);
       setCurrentQuestion(0);
       setUserAnswer({});
       setShowResults(false);
       submittedRef.current=false;
       if(window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleAnswerSelect = (answerIndex) =>{
        const newAnswers={
            ...userAnswer,
            [currentQuestion]:answerIndex
        };
        setUserAnswer(newAnswers);
        setTimeout(()=>{
            if(currentQuestion < getQuestons().lenth - 1){
                setCurrentQuestion((prev)=>prev+1);
            }else{
                setShowResults(true);
            }
        },500)
    };

    const getQuestions = ()=>{
        if(!selectedTech || !selectedLevel) return [];
        return questionsData[selectedTech]?.[selectedLevel] || [];
        }
        // calculate score
        const calculateScore = () =>{
            const questions = getQuestions();
            let correct = 0;
            questions.forEach((question, index)=>{
                if(userAnswer[index] == questionsData.correctAnswer){
                    correct++;
                }
            });
            return {
                correct,
                total:questions.length,
                percentage: questions.length 
                ? Math.round((correct / questions.length) * 100) : 0,

            }
        };

        // reset the quize
        const resetQuize = () =>{
            setCurrentQuestion(0);
            setUserAnswer({});
            setShowResults(false);
            submittedRef.current=false;
        };

        const questions = getQuestions();
        const currentQ= questions[currentQuestion];
        const score = calculateScore();

        const getPerformanceStatus = () =>{
            if(score.percentage >= 90)
                return{
                  text:"Outstanding!",
                  color:"bg-gradient-to-r from-amber-200 to-amber-300",
                  icon:<Sparkles className="text-amber-800" />
                };
                 if(score.percentage >= 75)
                return{
                  text:"Excellent!",
                  color:"bg-gradient-to-r from-blue-200 to-indigo-300",
                  icon:<Trophy className="text-amber-800" />
                };
                 if(score.percentage >= 60)
                return{
                  text:"Good Job!",
                  color:"bg-gradient-to-r from-green-200 to-teal-300",
                  icon:<Award className="text-amber-800" />
                };
                return {
                    text:"Keep Practicing!",
                  color:"bg-gradient-to-r from-gray-200 to-gray-300",
                  icon:<BookOpen className="text-amber-800" />
                };

            };

            const perforance = getPerformanceStatus();
            const toggleSidebar = ()=> setIsSidebarOpen((prev)=>!prev);
        
            const getAuthHeader = ()=>{
                const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || null;
                return token ? {Authorization : `Bearer ${token}`} : {};
            }
            const submitResult = async()=>{
                if(submittedRef.current) return;
                if(!selectedTech || !selectedLevel) return;

                  const payload = {
                 title :`${selectedTech.toUpperCase()} - ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} quize`,
                 technology: selectedTech,
                 level: selectedLevel,
                 totalQuestions:score.total,
                 correct:score.correct,
                 wrong:score.total - score.correct,
            }
            try {
                submittedRef.current = true;
                toast.info('Saving your result..');
                const res = await axios.post(`${API_BASE}/api/results`, payload,{
                    headers:{
                        'Content-Type':'application/json',
                        ...getAuthHeader(),
                    },
                    timeout:10000,
                });
                if(res.data && res.data.success){
                    toast.success("Result saved!")
                }else{
                    toast.warn('Result not saved.');
                    submittedRef.current=false;
                }
            } catch (error) {
                // ignore
                submittedRef.current=false;
                console.error("error saving result", error?.response?.data || error.message || error);
                toast.error("Could not save result. Check console or network.")
            }
            };

            useEffect(()=>{
                if(showResults){
                    submitResult();
                }
            },[showResults])

          

    return (
        <div className={sidebarStyles.pageContainer}>
        {isSidebarOpen && (
            <div onClick={()=>window.innerWidth < 768 && setIsSidebarOpen(false)} className={sidebarStyles.mobileOverlay}></div>
        )}

        <div className={sidebarStyles.mainContainer}>
      <aside
  ref={asideRef}
  className={`${sidebarStyles.sidebar} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
>
 <div className={sidebarStyles.sidebarHeader}>
   <div className={sidebarStyles.headerDecoration1}></div>
   <div className={sidebarStyles.headerDecoration2}></div>
   <div className={sidebarStyles.headerContent}>
     <div className={sidebarStyles.logoContainer}>
        <div className={sidebarStyles.logoIcon}>
           <BookOpen size={28} className="text-indigo-700" />
        </div>
     </div>
   </div>
 </div>
</aside>

        </div>
            
        </div>
    );
};

export default Sidebar;