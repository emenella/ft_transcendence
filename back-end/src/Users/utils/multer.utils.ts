import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { User } from "../entity/User.entity";

export const factory = async (): Promise<MulterModuleOptions> => {
    console.log("Multer factory called!");
    return { 
        storage: diskStorage({
            filename: async (req , file, cb) => {
                if (!req.user) {
                    cb(new Error('User not found!'), "");
                }
                const user: User = req.user as User;
                const filename = `avatar-${user.username}`;
                const extension = file.mimetype.split('/')[1];
                console.log(`${filename}.${extension}`);
                cb(null, `${filename}.${extension}`);
            },
            destination: "./uploads/",
        }),
        fileFilter: (req, file, cb) => {
            req;
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed!'), false);
            }
        },
    };
}
