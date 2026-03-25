const express=require("express");

const interviewRouter=express.Router();
const interviewController=require("../controllers/interview.controller");
const upload=require("../middlewares/file.middleware");
const authMiddleware=require("../middlewares/auth.middlewares");


/**
 * @route POST /api/interview
 * @description Generate interview report based on resume and job description
 * @access Private (Requires authentication)
 */

// We will use authMiddleware to protect this route and allow only authenticated users to access it
// We will use upload.single('resume') to handle file upload and expect the file field name to be 'resume' 
interviewRouter.post('/',authMiddleware.authUser,upload.single('resume'), interviewController.generateInterviewReportController);

/**
 * @route POST /api/interview/resume-pdf
 * @description Generate a tailored resume PDF based on job description and candidate profile
 * @access Private (Requires authentication)
 */
interviewRouter.post('/resume-pdf', authMiddleware.authUser, upload.single('resume'), interviewController.generateResumePdfController);



 module.exports=interviewRouter;
