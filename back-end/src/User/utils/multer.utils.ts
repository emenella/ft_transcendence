import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { User } from "../entity/User.entity";

export const factory = async (): Promise<MulterModuleOptions> => {
	return { 
		storage: diskStorage({
			filename: async (req , file, callback) => {
				if (!req.user)
					callback(new Error("User not found!"), "");
				const user: User = req.user as User;
				const filename = `avatar-${user.id}`;
				const extension = file.mimetype.split("/")[1];
				callback(null, `${filename}.${extension}`);
			},
			destination: "./avatars/",
		}),
		fileFilter: (_req, file, callback) => {
			if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/))
				callback(null, true);
			else
				callback(new Error("Only image files are allowed!"), false);
		},
	};
}
