import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../Auth/Authenfication.module';
import { ChanModule } from './Chan/Chan.module';
import { UserModule } from '../Users/Users.module';
// import { ChatGateway } from './Chat.gateway';
import { ChatService } from './Chat.service';

@Module({
	imports: [
		UserModule,
		ChanModule,
		AuthenticationModule,
	],
	providers: [ChatService, /*ChatGateway*/],
	exports: [ChatService]
})
export class ChatModule {}