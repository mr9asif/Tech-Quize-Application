import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { resultStyles } from "../assets/dummyStyles";

const Badge = ({percent}) =>{
    if(percent >= 85)
        return <span className={resultStyles.badgeExcellent}>Excellent</span>
    if(percent >= 65)
        return <span className={resultStyles.badgeGood}>Good</span>
     if(percent >= 45)
        return <span className={resultStyles.badgeAverage}>Average</span>

     return <span className={resultStyles.badgeNeedsWork}>Needs Work</span>;
}

const Myresult = ({apiBase="http://localhost:4000"}) => {
    const [results, setResults]=useState(null);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);
    const [selectedTechnology, setSelectedTechnology]=useState("all");
    const [technologies, setTechnologies]=useState([]);

    const getAuthHeader = useCallback(()=>{
        const token = localStorage.getItem("token") || localStorage.getItem("authToken") || null;
        return token ? {Authorization: `Bearer ${token}`} : {};
    },[])

    // Effect: fetch results when components mounts or when selectedTechnology changes
    useEffect(()=>{
        let mounted = true;
        const fetchResults = async (tech = "all") =>{
            setLoading(true);
            setError(null);
            try {
                 const q =
                 tech && tech.toLowerCase() !== "all"
                 ? `?technology=${encodeURIComponent(tech)}` : "";
                 const res = await axios.get(`${apiBase}/api/results${q}`, {
                    headers:{"Content-Type" : "application/json", ...getAuthHeader()},
                    timeout: 10000,
                 });
                 if(!mounted) return;
                 if(res.status === 200 && res.data && res.data.success){
                    setResults(Array.isArray(res.data.results) ? res.data.results : []);
                 }else{
                    setResults([]);
                    toast.warn("Unexpected server response while fetching results.");
                 }
            } catch (error) {
                console.error(
                    "Failed to fetch results",
                    error?.response?.data || error.message || error
                );
                if(!mounted) return;
                if(error?.response?.status === 401){
                    setError("Not authenticated. please log in to view results");
                    toast.error("Not authenticated. please login");
                }else{
                    setError("Could not load results from server.");
                    toast.error("Could not load results from server");
                    setResults([]);
                }
            }finally{
                if(mounted) setLoading(false)
            }
        };

        fetchResults(selectedTechnology);
        return ()=>{
            mounted = false;
        };

    },[apiBase, selectedTechnology, getAuthHeader]);

    // Effect: fetch all results once to build a list
    // of available technologis for filter buttons
    useEffect(()=>{
        let mounted = true;
        const fetchAllForTechList = async ()=>{
            try {
                const res = await axios.get(`${apiBase}/api/results`, {
                    headers:{"Content-Type" : "application/json", ...getAuthHeader()},
                    timeout: 10000,
                });
                if(!mounted) return;
                if(res.status === 200 && res.data && res.data.success){
                    const all = Array.isArray(res.data.results) ? res.data.results : [];
                    const set = new Set();
                    all.forEach((r)=>{
                        if(r.technology) set.add(r.technology);
                    });
                    const arr = Array.from(set).sort((a,b)=> a.localeCompare(b));
                    console.log(arr);
                    setTechnologies(arr);
                }else{
                    // leave technologies empty will show ALl
                }
            } catch (error) {
                console.error(
                    "Failed to fetch technologies",
                    error?.response?.data || error.message || error
                );
            }
        };
        fetchAllForTechList();
        return ()=>{
            mounted = false;
        };
    }, [apiBase, getAuthHeader]);

    const makeKey = (r)=> (r && r._id ? r._id : `${r.id}||${r.title}`);

    // summary is memoized so it only recalculates when results changes. it aggregates totals and computes an overall percentage.
    const summary = useMemo(()=>{
        const source = Array.isArray(results) ? results : [];
        const totalQs = source.reduce(
            (s,r)=> s+ (Number(r.totalQuestions) || 0),
            0
        );
        const totalCorrect = source.reduce(
            (s,r)=> s + (Number(r.correct) || 0),
            0
        );
        const totalWrong = source.reduce((s,r)=> s + (Number(r.wrong) || 0), 0);
        const pct = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;
        return {totalQs, totalCorrect, totalWrong, pct};
    }, [results]);

    // group results by the first word of the title (used as track)
    const grouped = useMemo(()=>{
        const src = Array.isArray(results) ? results : [];
        const map = {};
        src.forEach((r)=>{
            const track = (r.title || "").split(" ")[0] || "General";
            if(!map[track]) map[track] = [];
            map[track].push(r);
        });
        return map;
    }, [results]);

    // Handler called when clicks a technology filter button
    const handleSelectTech = (tech) =>{
        setSelectedTechnology(tech || 'all');
    };

    return (
        <div className={resultStyles.pageContainer}>
             <div className={resultStyles.container}>
                 <header className={resultStyles.header}>
                    <div>
                      <h1 className={resultStyles.title}>
                       Quize Results
                      </h1>
                    </div>

                    <div className={resultStyles.headerControls}>
                       
                    </div>
                 </header>
                 <div className={resultStyles.filterContainer}>
                   <div className={resultStyles.filterContent}>
                     <div className={resultStyles.filterButton}>
                        <span className={resultStyles.filterLabel}>Filter by tech:</span>
                        <button onClick={()=>handleSelectTech('all')} className={`${resultStyles.filterButton} ${selectedTechnology === 'all' ? resultStyles.filterButtonActive : resultStyles.filterButtonInactive}`} >All</button>


                        {/**dynamic technology buttons */}
                        {technologies.map((tech)=>(
                            <button 
                             key={tech}
                             onClick={()=> handleSelectTech(tech)}
                             className={`${resultStyles.filterButton} ${selectedTechnology === tech 
                                ? resultStyles.filterButtonActive 
                                : resultStyles.filterButtonInactive
                                }`}
                            >
                            {tech}
                            </button>
                        ))}

                        {/** if we don't yet have technologies but result exist, drive from current results */}
                        {technologies.length === 0 &&
                            Array.isArray(results) &&
                            results.length > 0 &&
                            [
                                ...new Set(results.map((r)=>r.technology).filter(Boolean)),
                            ].map((tech)=>(
                                <Button
                                key={`fallback-${tech}`}
                                onClick={()=> handleSelectTech(tech)}
                                className={`${resultStyles.filterButton} ${
                                    selectedTechnology === tech
                                    ? resultStyles.filterButtonActive :
                                    resultStyles.filterButtonInactive
                                    }`}
                                    aria-presed = {selectedTechnology === tech}
                                >{tech}</Button>
                            ))}
                     </div>
                     <div className={resultStyles.filterStatus}>
                     {selectedTechnology === 'all' ? 
                        'Showing all technologis' : `Filtering: ${selectedTechnology}`
                     }
                     </div>
                   </div>
                 </div>
             </div>
        </div>
    );
};

export default Myresult;