const {User} = require("../models/model");
const bcrypt = require("bcrypt");

const userController = {
    addUser: async(req, res) => {
        try {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllUser: async(req, res) => {
        try {
            const allUser = await User.find();
            res.status(200).json(allUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllUserPaignation: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    
            const allUser = await User.find()
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                users: allUser,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getUser: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateUser: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            await user.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    searchUser: async (req, res)=> {
        try {
            const searchValue = req.body.text
            const filteredUsers = await User.find({
                name: { $regex: new RegExp(searchValue, "i") } 
            });
            let count = filteredUsers.length  
            res.status(200).json({
                users: filteredUsers,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },
    createUser: async(req, res) => {
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
                phone: req.body.phone,
                role: req.body.role
            });
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },
    updateUserInfo: async (req, res) => {
        const {userID, stk, personSTK, bank, cccd, cccdDate, cccdPlace, resident, nation, religion, marriage} = req.body;
        try {
          const parentUser = await User.findById(userID);
          if (!parentUser) {
            return res.status(404).json({ error: 'User not found' });
          }
          parentUser.person = { stk, personSTK, bank, cccd, cccdDate, cccdPlace, resident, nation, religion, marriage };
          await parentUser.save();
      
          res.status(201).json(parentUser);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    changePassword: async (req, res) => {
        try {
            const { userId, currentPassword, newPassword } = req.body;

            const user = await User.findById(userId);
    
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
            user.password = hashedNewPassword;
            await user.save();
    
            res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Đã có lỗi xảy ra' });
        }
    }

}
module.exports = userController;