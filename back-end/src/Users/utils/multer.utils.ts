import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { UserService } from "../service/User.service";
import { diskStorage } from "multer";

export const factory = async (userService: UserService): Promise<MulterModuleOptions> => {
    return { 
        storage: diskStorage({
            filename: async (req, file, cb) => {
                const user = await userService.getUserFromConnectionId(req.user.userId);
                console.log(file);
                const filename = `avatar-${user.username}`;
                const extension = file.mimetype.split('/')[1];
                console.log(`${filename}.${extension}`);
                cb(null, `${filename}.${extension}`);
            },
            destination: "./uploads/",
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed!'), false);
            }
        },
    };
}
