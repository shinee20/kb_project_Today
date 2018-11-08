const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
const upload = require('../../../config/multer');

var multiUpload = upload.fields([{ name: 'profile_img' }]);

router.put('/', multiUpload, async(req, res, next) => {
	const ID = jwt.verify(req.headers.authorization);
    let readProfile = 'select * from USER where user_idx = ?';
    let updateProfile = 'update USER set ? where user_idx = ?';


    if(ID!=-1){
    	let profile = await db.execute3(readProfile, ID);
    	if (profile.length === 0)
            res.status(403).send({
                message: 'profile does not exist'
            });
        else{
        	let data = {
                profile_img : req.files.profile_img ? req.files.profile_img[0].location : profile[0].profile_img
            };
            let result = await db.execute3(updateProfile, data, ID);
            //console.log(result);
            if(result){
                res.status(200).send({
                    message: 'update success'
                });
            }else{
                res.status(405).send({
                    message: 'fail'
                }); 
            }
        }
    }else{
    	res.status(401).send({
            message: "access denied"
        });
    }

});

module.exports = router;