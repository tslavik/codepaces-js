import { ServiceBusClient } from '@azure/service-bus';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ServiceBus } from './bus.service';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Message } from './dto/servicebus';

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING || "<connection string>";
const queueName = process.env.QUEUE_NAME_WITH_SESSIONS || "<queue name>";
const sbClient = new ServiceBusClient(connectionString);
const sessionId = "session-1";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private serviceBus: ServiceBus) {}

  @Get()
  getHello(): string {
    console.log("Hello");

    return this.appService.getHello();
  }

  @Get('getmessage')
  getMessage(): string {
    const body:Message = {uuid:uuidv4(),date: new Date}
    console.log(body);
    this.serviceBus.receiveMessages(sbClient,sessionId);
    return "ok";
  }

  @Post('message')
  postMessage(@Body() msg: any) : string {
    console.log(msg);

    let obj = msg.body;
    let ret = [];
    // Potential DoS if obj.length is large.
    for (let i = 0; i < obj.length; i++) {
        ret.push(obj[i]);
    }
    const body:Message = {uuid:uuidv4(),date: new Date}
    console.log(body);
    this.serviceBus.sendMessage(sbClient,body,msg.count,sessionId);
    return "ok";
  }

}
