const express = require("express");
const amqp = require("amqplib");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.listen(PORT, () => console.log("Server running at port " + PORT));

var channel, connection;
connectQueue()  // call the connect function
 
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
        channel.consume("test-queue", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}