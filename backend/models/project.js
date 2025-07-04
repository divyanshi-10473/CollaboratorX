import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
        },
    
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    fileTree:{
        type: Object, 
        default: {}
    }
} ,{
  timestamps: true 
}
)

const Project = mongoose.model('Project', projectSchema)
export default Project