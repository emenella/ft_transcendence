import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";

export const factory = async (): Promise<MulterModuleOptions> => {
    return { 
        storage: diskStorage({
            filename: async (req, file, cb) => {
                if (!req.body.user) {
                    cb(new Error('User not found!'), "");
                }
                const filename = `avatar-${req.body.user.username}`;
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
