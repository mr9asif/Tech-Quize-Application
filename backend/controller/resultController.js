
export async function createResult(req, res){
     try {
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success:false,
                message:"not authorize"
            })
        }
        const {title, technology,level, totalQuestion, correct, wrong} = req.body;
        if(!technology || !level || totalQuestion === undefined || correct === undefined){
            return res.status(400).json({
                success:false,
                message:"Missing fields"
            })
        }

        // compute wrong if not provided
        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestion) - Number(correct));

        if(!title){
            return res.status(400).json({
                success:false,
                message:"Missing Title"
            })
        }

        const payload={
            title:String(title).trim(),
            technology,
            level,
            totalQuestion:Number(totalQuestion),
            correct:Number(correct),
            wrong:computedWrong,
            user:req.user.id
        }
        const created = await Result.create(payload);
        return res.status(201).json({
            success:true,
            message:"Result created",
            result:created
        })
     } catch (error) {
        console.error("createdResult errr:" , error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        })
     }
}

// list the result
export async function listResult(req, res){
    try {
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success:false,
                message:"not authorize"
            })
        }

        const {technology} = req.query;
        const query = {user: req.user.id};
        if(technology && technology.toLowercase() !== 'all'){
            query.technology = technology;
        }

        const item = await Result.find(query).sort({createdAt: -1}).lean();
        return res.json({
            success:true,
            results: item
        })
    } catch (error) {
        console.error("listResults errr:" , error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        })
     }
}