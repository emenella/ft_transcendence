import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../Auth/Authenfication.module';
import { ChanModule } from './Chan/Chan.module';
import { UserModule } from '../User/User.module';
import { MessageModule } from './Message/Message.module';
import { ChatGateway } from './Chat.gateway';
import { ChatService } from './Chat.service';

@Module({
	imports: [
		UserModule,
		MessageModule,
		ChanModule,
		AuthenticationModule,
	],
	providers: [ChatService, ChatGateway],
	exports: [ChatService]
})
export class ChatModule {}