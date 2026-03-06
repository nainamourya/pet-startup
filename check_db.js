import mongoose from 'mongoose';

async function check() {
    await mongoose.connect('mongodb://petsitter:yh6jssExjMjiLUOs@ecommerce-shard-00-00.pyrak.mongodb.net:27017,ecommerce-shard-00-01.pyrak.mongodb.net:27017,ecommerce-shard-00-02.pyrak.mongodb.net:27017/petsitter?ssl=true&authSource=admin&retryWrites=true&w=majority');
    const collection = mongoose.connection.db.collection('bookings');
    const bookings = await collection.find({ "payment.paid": true }).limit(5).toArray();
    console.log("Paid Bookings:", JSON.stringify(bookings.map(b => ({
        id: b._id,
        payment: b.payment,
        status: b.status,
        completedAt: b.completedAt
    })), null, 2));
    process.exit(0);
}
check();
