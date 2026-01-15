class ExpressError extends Error {
    constructor(status, message) {
        super(message);   // always pass message to super()
        this.status = status;
        this.message=message;
    }
}

module.exports = ExpressError;
