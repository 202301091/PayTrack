const asyncHandler = (requsethandler) => {
   return async (req, res, next) => {
        Promise.resolve(requsethandler(req, res, next)).catch(next);
}
}

export default asyncHandler;
