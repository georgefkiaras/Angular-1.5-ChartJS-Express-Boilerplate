var wrapAsync = fn =>{
    return (req, res, next) => {
        const promise = fn(req, res, next)
        if(promise.catch)
            promise.catch(err => next(err))
    }
}


module.exports = wrapAsync