import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Sitter from './backend/models/Sitter.js';
import User from './backend/models/User.js';

async function testSave() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/petsitter');
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
            console.error("Save failed with error:", err);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error("Init error:", err);
    }
}

testSave();
