import User from '../models/user'


export const validPass = async( password ='' ) => {
    await User.findOne({ password });
    let mayus = /[A-Z]+/;
    let minus = /[a-z]+/;
    let digito = /[0-9]+/;
    let character = /[!"#$%&'()*+,\-./:;<=>?@^_`{|}]+/;
    
    if( (mayus.test(password) && minus.test(password) && digito.test(password) && character.test(password) ) !=true){
      throw new Error(`Password must be contain one uppercase and lowercase letter one digito and one special character`);
    }
}