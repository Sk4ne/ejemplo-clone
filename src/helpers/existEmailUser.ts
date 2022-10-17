import User from '../models/user'

export const existEmail = async( email ='' ) => {
   const uniqueEmail = await User.findOne({ email });
   if(uniqueEmail){
      /* console.log(uniqueEmail.email); */
      throw new Error(`Email ${email } is already in use`)
   }
}
