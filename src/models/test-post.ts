import mongoose,{Schema,Types} from "mongoose";

interface Post extends mongoose.Document{
  title:string;
  description:string;
  // Image es opcional
  image?:string;
  user:Types.ObjectId;
  createAt:Date;
  state:boolean; 
}

const PostSchema = new Schema({
   title:{type:String,required:[true,'title is required']},
   description:{type:String,required:true},
   image:{type:String},
   user:{type:Schema.Types.ObjectId,ref:'User'},
   createAt:{type:Date,default: Date.now()},
   state:{type:Boolean,default:true} 
},{versionKey:false});

// const Post = mongoose.model<Post>('Post',PostSchema);
// export default Post; 
