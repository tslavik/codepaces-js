import { Injectable } from '@nestjs/common';
import { delay, ProcessErrorArgs, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";

import { v4 as uuidv4 } from 'uuid';
// Load the .env file if it exists
import * as dotenv from "dotenv";
import { Message } from './dto/servicebus';
dotenv.config();

// Define connection string and related Service Bus entity names here
// Ensure on portal.azure.com that queue/topic has Sessions feature enabled
const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING || "<connection string>";
const queueName = process.env.QUEUE_NAME_WITH_SESSIONS || "<queue name>";
const sbClient = new ServiceBusClient(connectionString);

@Injectable()
export class ServiceBus {


  async sendMessage(sbClient: ServiceBusClient, msg: Message, count: Number, sessionId: string) {
    // createSender() also works with topics
    const sender = sbClient.createSender(queueName);
  
    // only for test LGTM
    count === NaN;

    let msgc = 0;
    while (msgc<count) {

      const message = {
        body: {uuid:uuidv4(),date: new Date},
        label: "Message",
        sessionId: sessionId
      };

      console.log(`Sending message: "${JSON.stringify(msg)}" to "${sessionId}"`);
      await sender.sendMessages(message);
      
      msgc++;
    }
    
    await sender.close();
  
    
    console.log("sender closed");
  }
  
  async receiveMessages(sbClient: ServiceBusClient, sessionId: string) {
    // If receiving from a subscription you can use the acceptSession(topic, subscription, sessionId) overload
    const receiver = await sbClient.acceptSession(queueName, sessionId);
  
    const processMessage = async (message: ServiceBusMessage) => {
      console.log(`Received: ${message.sessionId} - ${JSON.stringify(message.body)} `);
    };
    const processError = async (args: ProcessErrorArgs) => {
      console.log(`>>>>> Error from error source ${args.errorSource} occurred: `, args.error);
    };
    receiver.subscribe({
      processMessage,
      processError
    });
  
    
    //await delay(300);
    await receiver.close();
  }
}
