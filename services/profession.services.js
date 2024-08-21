import bcrypt from 'bcryptjs';
import ProfessionalModel from '../models/profession.model.js';
import Authentication from './auth.services.js';


class ProfessionService{
    static async registerProfession(name,email,password, phoneNumber, dateOfBirth, nationality, address, profession, experience,  languageToProvideService, pricePerHour, verificationStatus){
        try{
            const newProfessional = new ProfessionalModel({name,email,password, phoneNumber, dateOfBirth, nationality, address, profession, experience,  languageToProvideService, pricePerHour, verificationStatus});
            return await newProfessional.save();
        }catch(e){
            throw new Error(`Failed to register Profession ${e}`);
        }
    }

    static async loginProfessional(professionalsEmail, professionalsPassword){
        const professional = await ProfessionalModel.findOne({email: professionalsEmail});
        if(!professional || !(await bcrypt.compare(professionalsPassword, professional.password))){
            return null;
        }

        const { 
            _id,
            name,
            email,
            phoneNumber,
            dateOfBirth,
            nationality,
            address,
            profession,
            experience,
            languageToProvideService,
            pricePerHour,
            verificationStatus} = professional;

        let tokenData = {
            _id : _id,
            name : name,
            email : email,
            phoneNumber : phoneNumber,
            dateOfBirth : dateOfBirth,
            nationality : nationality,
            address : address,
            profession : profession,
            experience : experience,
            languageToProvideService : languageToProvideService,
            pricePerHour : pricePerHour,
            verificationStatus : verificationStatus
        };

        const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';
        const token = Authentication.generateToken(tokenData,SECRET_KEY,{ expiresIn: '1h' });
        return token;
    }

    
}

export default ProfessionService;