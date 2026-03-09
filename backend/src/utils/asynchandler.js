
//This is use for handling asynchronous route handlers in Express.js applications.
const asyncHandler = (requsethandler) => {
   return async (req, res, next) => {
        Promise.resolve(requsethandler(req, res, next)).catch((error)=>{console.error(`Error: ${error.message}`); // Log the error message
    })
}
}

export default asyncHandler;

// const asyncHandler = (fn) =>async (req,res,next)=>{
//     try{
//         await fn(req,res,next);
//     }catch(error){
//         console.error(`Error: ${error.message}`);
//         res.status(500).json({success:false,message: 'Internal Server Error'});
//     }
// }