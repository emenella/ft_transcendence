import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { Message } from "./Message.entity";
import { MessageService } from "./Message.service";

@Controller("Message")
export class MessageControllers {}