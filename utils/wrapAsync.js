module.exports = (fn) => {
    return (req, res, next) => {
        // Corrected: Catch the error and pass it to the next middleware (the error handler)
        fn(req, res, next).catch(err => {
            // Optional: You can still log it here if you like
            console.error("Async Error Caught:", err);
            
            // CRITICAL: Call next() with the error
            next(err); 
        });
    }
}