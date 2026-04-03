import mangoose from 'mongoose';

const noteSchema =new mangoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
});

const Note = mangoose.model('Note',noteSchema);

export default Note;