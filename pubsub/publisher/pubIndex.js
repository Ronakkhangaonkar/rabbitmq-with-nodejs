const express = require("express");
const amqp = require("amqplib");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
let channel, connection;
app.use(express.json());

app.get("/math-task/sum", (req, res) => {
  let inputOfA = parseInt(req.body.a);
  let inputOfB = parseInt(req.body.b);
  let sum = Number(inputOfA + inputOfB);
  sendData(sum); // pass the data to the function we defined
  console.log("A message is sent to queue");
  res.send("Message Sent For Addition:" + Number(sum)); //response to the API request
});

app.get("/math-task/mul", (req, res) => {
  let inputOfA = parseInt(req.body.a);
  let inputOfB = parseInt(req.body.b);
  let product = Number(inputOfA * inputOfB);
  sendData(product); // pass the data to the function we defined
  console.log("A message is sent to queue");
  res.send("Message Sent For Multiplication:" + Number(product)); //response to the API request
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => console.log("Server running at port " + PORT));

async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertQueue("test-queue");
  } catch (error) {
    console.log(error);
  }
}

async function sendData(data) {
  try {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));

    // close the channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.log(error);
  }
}

connectQueue();
