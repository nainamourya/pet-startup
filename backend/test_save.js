import mongoose from 'mongoose';
import Sitter from './models/Sitter.js';

async function testSave() {
    try {
        await mongoose.connect('mongodb://petsitter:yh6jssExjMjiLUOs@ecommerce-shard-00-00.pyrak.mongodb.net:27017,ecommerce-shard-00-01.pyrak.mongodb.net:27017,ecommerce-shard-00-02.pyrak.mongodb.net:27017/petsitter?ssl=true&authSource=admin&retryWrites=true&w=majority');
        console.log("Connected to DB");

        const sitter = await Sitter.findOne();
        if (!sitter) {
            console.log("No sitter found");
            return;
        }
        console.log("Found sitter:", sitter._id);

        try {
            sitter.name = sitter.name + " Test";
            await sitter.save();
            console.log("Save successful!");
        } catch (err) {
            console.error("🔥 SAVE ERROR DETAILS:");
            if (err.errors) {
                Object.keys(err.errors).forEach(key => {
                    console.error(`- ${key}:`, err.errors[key].message);
                });
            } else {
                console.error(err);
            }
        }

        mongoose.disconnect();
    } catch (err) {
        console.error("Init error:", err);
    }
}

testSave();
