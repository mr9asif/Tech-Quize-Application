import mongoose from 'mongoose';

const performanceenum = ['Excellent', 'Good', 'Average', 'Needs work'];

const resultSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId, ref:"User", required:false
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    technology:{
        type:'String',
        required:true,
        trim:true,
        enum:[
            "html", "css","js","react","node","mongodb","java","python","cpp","bootstrap"
        ]
    },
    level:{
        type:"String", reuired:true, trim:true,enum:["basic","intermediate","advanced"]
    },
    totalQuestion:{type:Number, required:true, min:0},
    correct:{type:Number, required:true, min:0, default:0},
    wrong:{type:Number, required:true, min:0, default:0},
    score:{type:Number, min:0, max:0, default:0},
    performance:{type:String, enum:performanceenum, default:"needs work"}

}, {timestamps:true});

// compute score and performance
resultSchema.pre('save', function(next){
    const total = Number(this.totalQuestion) || 0;
    const correct = Number(this.correct) || 0;
    this.score = total ? Math.round((correct / total) * 100) : 0;
    if(this.score >=85) this.performance == 'Excellent'
    else if(this.score >=65) this.performance == 'Good'
    else if(this.score >=45) this.performance == 'Average'
    else this.score == 'Needs Word'

    if((this.wrong == undefined || this.wrong == null) & total){
        this.wrong = Math.max(0,total-correct);
    }
    next();
});

const result = mongoose.models.Result || mongoose.model('Result', resultSchema);
export default result;