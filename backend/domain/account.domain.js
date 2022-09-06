const Account = require("../model/account.model");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const Login = require("../model/login.model");
const connection = require("../connection");
const Otp = require("../model/otp.model");
var _ = require('lodash');
require("dotenv").config();
const twilio = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const {
  accountValidate,
  loginValidate,
  passwordValidate,
} = require("../validations/account.validations");
const { getIncrementedId, generateOTP } = require("../commonFunctions");
class AccountDomain {
  static async addAccount(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      let body = req.body;
      const { error } = accountValidate(body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const findOtp = await Otp.findOne({ number: req.body.mobileNumber }).sort(
        { createdAt: -1 }
      );
      if (!findOtp) {
        return res
          .status(400)
          .json({
            message: "no otp found for this number please generate a new otp",
          });
      }
   
      const checkOtp = await bcrypt.compare(req.body.otp, findOtp.otp);
      if (!checkOtp) {
        return res.status(401).json({ message: "invalid otp" });
      }
      await Otp.deleteMany({ number: req.body.mobileNumber });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      body.password = hashedPassword;
      const account = await Account.create([body], { session });
      let counter = await getIncrementedId(User, "userId");
      const users = await User.create(
        [{ ...body, userId: ++counter, accountId: account[0]._id }],
        { session }
      );
      await session.commitTransaction();
      res.status(200).json({ message: "success", data: _.pick(users,['userId','userName','profileImage']) });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    }
    session.endSession();
  }

  static async verifyUser(req, res, next) {
    try {
      const { error } = loginValidate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const userExists = await User.find({ userName: req.body.loginId });
      if (userExists.length === 0) {
        return res
          .status(401)
          .json({
            message: "no user found please check your userName and password",
          });
      }
      const { password } = req.body;
      const checkPassword = await bcrypt.compare(
        password,
        userExists[0].password
      );
      if (!checkPassword) {
        return res
          .status(401)
          .json({
            message: "incorrect user please check your password and try again",
          });
      }
      res.status(200).json({ message: "user verified" });
    } catch (error) {
      next(error);
    }
  }

  static async generateOtp(req, res, next) {
    try {
      const otp = generateOTP();
      const { loginId } = req.body;
      let mobileNumber = "";
      let userName = "";
      let reg = /^\d+$/;
      if (loginId.length === 10&&reg.test(loginId)) {
        mobileNumber = loginId;
      } else {
        userName = loginId;
      }
      if (!mobileNumber) {
        const user=  await User.findOne({userName})
         mobileNumber=user.mobileNumber
      } 
      twilio.messages.create({
          from:process.env.TWILIO_PHONE_NUMBER,
          to:`+91${mobileNumber}`,
          body:
          `${otp} is your instagram code.
          Don't share it.`
      })
      .then(async()=>{
          const salt = await bcrypt.genSalt(10)
          const hashedOtp = await bcrypt.hash(otp, salt)
       const result= await Otp.create({mobileNumber,otp:hashedOtp})
          res.json({message:'otp send successfully'})
      })
      .catch(error=>{
          if(error.status===400)
          {
              return res.status(400).json({message:"this number is not verified please enter a verified number"})
          }})
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req, res, next) {
    try {
      const { error } = loginValidate(req.body);
      if (error && req.body.otp.length === 6) {
        res
          .status(400)
          .json({
            message:
              error.details[0].message ||
              "otp should be only 6 characters long",
          });
        return;
      }
      const { loginId, otp } = req.body;
      let mobileNumber = null;
      let userName = null;
      let reg = /^\d+$/;
      if (loginId.length === 10&&reg.test(loginId)) {
        mobileNumber = loginId;
      } else {
        userName = loginId;
      }
      let findOtp = {};
      let findUser = {};
      let loginData = {};
      if (userName) {
        findUser = await User.findOne({ userName });
        findOtp = await Otp.findOne({ mobileNumber:findUser.mobileNumber }).sort({ createdAt: -1 });
        loginData["userName"] = userName;
        if (!findOtp) {
          return res
            .status(400)
            .json({
              message: "no otp found for this number please generate a new otp",
            });
        }
      } else if (mobileNumber) {
        findOtp = await Otp.findOne({ mobileNumber }).sort({ createdAt: -1 });
        findUser = await User.findOne({ mobileNumber });
        loginData["mobileNumber"] = mobileNumber;
        if (!findOtp) {
          return res
            .status(400)
            .json({
              message: "no otp found for this number please generate a new otp",
            });
        }
      }
      const checkOtp = await bcrypt.compare(otp, findOtp.otp);
      if (!checkOtp) {
        return res.status(401).json({ message: "Invalid Otp" });
      }
      let counter = await getIncrementedId(Login, "loginId");
      loginData = {
        ...loginData,
        loginId: ++counter,
        userId: findUser.userId,
        password: findUser.password,
      };
      const newLogin = await Login.create(loginData);
      
      res
        .header("x-auth-token", newLogin.generateToken())
        .status(200)
        .json({ data: {..._.pick(newLogin,['userId','userName']),profileImage:findUser.profileImage} });
    } catch (error) {
      next(error);
    }
  }
  static async checkUserName(req, res, next) {
    try {
      const { userName } = req.params;
      const isUserNameExists = await Account.find({
        userName:new RegExp('^'+userName+'$', "i") 
      });
      if (isUserNameExists.length > 0) {
        return res.status(406).json({ message: "userName not available" });
      }
      res.status(200).json({ message: "userName available" });
    } catch (error) {
      next(error);
    }
  }
  static async findAccount(req, res, next) {
    try {
      const  userName  = req.params.userName;
      const isAccountExists = await Account.find({
        userName
      });
      if (isAccountExists.length === 0) {
        return res.status(404).json({ message: "no user found please enter valid username" });
      }
const otp = generateOTP()
            twilio.messages.create({
          from:process.env.TWILIO_PHONE_NUMBER,
          to:`+91${isAccountExists[0].mobileNumber}`,
          body:
          `${otp} is your instagram code.
          Don't share it.`
      })
      .then(async()=>{
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
      await Otp.create({ mobileNumber:isAccountExists[0].mobileNumber, otp: hashedOtp });
        res.json({message:'otp send successfully',data:[{otp,..._.pick(isAccountExists[0],['mobileNumber' ,'_id'])}]})
      })
      .catch(error=>{
          if(error.status===400)
          {
              return res.status(400).json({message:"this number is not verified please enter a verified number"})
          }})
    } catch (error) {
      next(error);
    }
  }
  static async verifyPasswordOtp(req, res, next) {
    try {
      const  {otp,mobileNumber}  = req.body;
      if (otp.length !== 6) {
        return res.status(400).json({ message: "invalid otp format otp should be 6 digits only" });
      }
      const findOtp = await Otp.findOne({ mobileNumber }).sort({ createdAt: -1 });
      const checkOtp = await bcrypt.compare(otp, findOtp.otp);
      if (!checkOtp) {
        return res.status(401).json({ message: "invalid otp" });
      }
      res.status(200).json({message:'otp verified',data:[]})
    } catch (error) {
      next(error);
    }
  }
  static async changePassword(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction()
      const { error } = passwordValidate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const {accountId,newPassword} = req.body
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword,salt)
      await Account.findOneAndUpdate({ _id:accountId },{password:hashedPassword},{session,new:true});
      await User.findOneAndUpdate({ accountId },{password:hashedPassword},{session,new:true});
      await session.commitTransaction()
      res.status(200).json({message:'Password changed successfully',data:[]})
    } catch (error) {
      await session.abortTransaction()
      next(error);
    }
    session.endSession()
  }
  static async findUsers(req, res, next) {
    try {
      const userData = req.query.search;
      const users = await User.find(
        {
            userName: { $regex: userData, $options: "i" } 
        },
        { password: 0 }
      ).populate(     {
        path: "virtualPosts",
        options: { sort: { createdAt: -1 } },
      });
 
      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  }
  static async getAccountDetails(req, res, next) {
    try {
      const userName = req.query.search;
      const users = await User.find(
        {
         userName: new RegExp('^'+userName+'$', "i") 
        },
        { password: 0 }
      ).populate(     {
        path: "virtualPosts",
        options: { sort: { createdAt: -1 } },
      });
 
      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AccountDomain;
