const auth = require('./auth')
const account = require('./account')
const center=require('./center')
const children=require('./children')
const activity=require('./activity')
const comment=require('./comment')
const like=require('./like')
const donor=require('./donor')
const payment=require('./payment')
const notification=require('./notification')
const adropt_detail=require('./adropt_detail')
const proofs=require('./proofs')
const adropt_request=require('./adropt_request')


function route(app) {

    app.use('/auth',auth)
    app.use('/',payment)
    app.use('/account',account)
    app.use('/center',center)
    app.use('/children',children)
    app.use('/activity',activity)
    app.use('/like',like)
    app.use('/comment',comment)
    app.use('/donor',donor)
    app.use('/notification',notification)
    app.use('/adropt_detail',adropt_detail)
    app.use('/proofs',proofs)
    app.use('/adropt_request',adropt_request)

}

module.exports = route;