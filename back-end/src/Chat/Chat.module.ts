import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../Auth/Auth';
import { ChanModule } from './Chan/Chan.module';
import { UserModule } from '../User/User.module';
import { MessageModule } from './Message/Message.module';
import { ChatGateway } from './Chat.gateway';
import { ChatService } from './Chat.service';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		MessageModule,
		ChanModule,
	],
	providers: [ChatService, ChatGateway],
	exports: [ChatService]
})
export class ChatModule {}