const express = require('express');
const router = express.Router();


router.get('/signup',(req, res) => {
    res.render('signup')
})

//Sign up logic
router.post('/signup', async (req, res) => {
    const {username ,password} = req.body;
    
    try{
        const user = new UserActivation({username,password})
        await user.save()
       
    }catch(error){
        res.status(400).send("error")
    } 
}
)

module.exports = router;
