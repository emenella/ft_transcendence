import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { User } from "../entity/User.entity";

export const factory = async (): Promise<MulterModuleOptions> => {
    return { 
        storage: diskStorage({
            filename: async (req , file, cb) => {
                if (!req.user)
                    cb(new Error('User not found!'), "");
                const user: User = req.user as User;
                const filename = `avatar-${user.id}`;
                const extension = file.mimetype.split('/')[1];
                cb(null, `${filename}.${extension}`);
            },
            destination: "./avatars/",
        }),
        fileFilter: (_req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/))
                cb(null, true);
            else
                cb(new Error('Only image files are allowed!'), false);
        },
    };
}
