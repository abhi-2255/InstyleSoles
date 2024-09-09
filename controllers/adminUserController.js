const User = require('../models/userModel')



const userList = async (req, res) => {
    try {
        const user = await User.find({isAdmin:false});

        res.render("admin/userList", { user });
    } catch (error) {
        console.log(error);
    }
};

const blockUnblockUser = async (req, res) => {
    console.log(req.query);
    try {
        const id = req.query.id;
        console.log(id);
        const data = await User.findById(id);
        const publish = data.isblocked === false ? true : false;
        const finded = await User.findByIdAndUpdate(id, {
            $set: {
                isblocked: publish,
            },
        });

        res.status(200).json({ status: true });
    } catch (error) {
        console.log(error);
    }
};







module.exports = {
    userList,
    blockUnblockUser,
}