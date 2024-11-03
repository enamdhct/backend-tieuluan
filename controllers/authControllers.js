const {User} = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const authController = {
    registerUser: async(req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                role: req.body.role,
                name: req.body.name,
                location: req.body.location,
                birthday: req.body.birthday,
                gender: req.body.gender,
                phone: req.body.phone
            });
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },
    //Generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            role: user.role
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "30d"}
        );
    },
    //generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            role: user.role
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
        );
    },
    loginUser: async(req, res) => {
        try{
            const user = await User.findOne({username: req.body.username})
            console.log(req.body);
            console.log(user);
            console.log(req.body.username)
            if(!user){
                return res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if(!validPassword){
                return res.status(404).json("Wrong password");
            }
            if(user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user); 
                res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,
                    secure: false,
                    path:"/",
                    sameSite: "strict",
                });
                const {password, ...orthers} = user._doc;
                return res.status(200).json({...orthers, accessToken});
            }
        }catch(err){
            return res.status(500).json(err)
        }
    },
    refreshToken: async(req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("You are not authenticated!");
        if(!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh Token is not valid!");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error,user)=>{
            if(error){
                console.log(error);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken,{
                httpOnly: true,
                secure: false,
                path:"/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },
    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out successfully");
    }
}


module.exports = authController;