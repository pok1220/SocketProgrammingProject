const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text:{
        type: String,
        required:[true,'Please add a text'],
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


//Reverse populate with virtual
// HospitalSchema.virtual('appointments',{
//     ref: "Appointment",
//     localField: "_id",
//     foreignField:"hospital",
//     justOne:false
// })

module.exports=mongoose.model('Hospital',HospitalSchema);