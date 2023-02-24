import { Module } from '@nestjs/common';
import { AuthentificationModule } from '../Auth/Authenfication.module';
import { ChanModule } from './Chan/Chan.module';
import { UserModule } from '../Users/Users.module';
import { ChatGateway } from './Chat.gateway';
import { ChatService } from './Chat.service';

@Module({
	imports: [
		UserModule,
		ChanModule,
		AuthentificationModule,
	],
	providers: [ChatService, ChatGateway],
	exports: [ChatService]
})
export class ChatModule {}