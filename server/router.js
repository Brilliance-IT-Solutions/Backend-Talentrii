const express = require('express');
const router = express.Router();
const authenticate = require('../server/middleware/authenticate')
const login = require('../server/controllersDB/loginDB')
const signUp = require('../server/controllersDB/signUpDB')
const upload = require("../server/middleware/image-uploader")
const deleteFile = require('../server/controllersDB/deleteFileDB')
const challange = require('../server/controllersDB/createChallangeDB')
const dashboard = require('../server/controllersDB/getDashboardDataDB')
const checkFileSizeBasedOnType = require("../server/middleware/filesize")
const privacyDB = require("../server/controllersDB/createPrivacyDB")
const getPrivacyDB = require("../server/controllersDB/getPrivacyDB");
const uploadVideo = require("../server/controllersDB/apiVideo")
const challengeLiked = require("../server/controllersDB/challengeLikedDB")
const challengeCommented = require("../server/controllersDB/challengeCommentedDB")
const getCommensChallenge = require("../server/controllersDB/getCommentsDataDB")
const getUserDetail = require("../server/controllersDB/getUserDetailDataDB")
const getPurposeChallenge = require("../server/controllersDB/purposeChallengeDB")
const updateProfileDB = require("../server/controllersDB/editProfileDB")
const getChallengeById = require("../server/controllersDB/getChallengesByChallengeId")
const getChallengeByUserId = require("../server/controllersDB/getChallengeByUserIdDB")
const GoogleSignUpDB = require("./controllersDB/googleSignUp")
const GoogleSignInDB = require("./controllersDB/googleSignInDB")

router.get('/', function (req, res, next) {
    res.send('SERVER STARTED');
});

router.post('/login', login.loginDB)
router.post('/signUp', signUp.signUpDB)
router.post('/createChallange', authenticate,challange.createChallangeDB)
router.post('/getDashboardData', authenticate, dashboard.getDashboardDataDB)
router.post('/privacy',authenticate , privacyDB.privacyDB)
router.get('/privacy',authenticate, getPrivacyDB.getPrivacyDB)
router.delete('/delete/:id',authenticate, deleteFile.deleteFileDB)
router.post('/upload' , upload.array('files',7) , uploadVideo.uploadVideo)
router.post('/likechallenge' , authenticate,challengeLiked.challengeLikedDB)
router.post('/commentChallenge' , authenticate,challengeCommented.challengeCommentedDB)
router.post('/getcommentChallenge' , authenticate,getCommensChallenge.getCommentsDataDB)
router.post('/getUserDetailById' , authenticate,getUserDetail.getUserDetailDataDB)
router.post('/getPurposeChallenge' , authenticate,getPurposeChallenge.PurposeChallengeDataDB),
router.patch('/updateProfile', authenticate,updateProfileDB.editProfileDB)
router.post('/getChallengeById', authenticate,getChallengeById.getChallengeByChallengeId)
router.post('/getChallengeByUserId',authenticate,getChallengeByUserId.getChallengeByUserIdDB)
router.post('/googleSignUp',GoogleSignUpDB.GoogleSignUpDB)
router.post('/googleSignIn',GoogleSignInDB.GoogleSignInDB)


module.exports = router;
