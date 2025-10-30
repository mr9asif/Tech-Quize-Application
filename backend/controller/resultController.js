
export async function createResult(req, res){
     try {
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success:false,
                message:"not authorize"
            })
        }
     } catch (error) {
        
     }
}