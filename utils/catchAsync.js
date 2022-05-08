module.exports = func => {
    console.log("hello catchAsync", this)
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}