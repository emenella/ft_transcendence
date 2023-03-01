export const filenameFunc = (req, file, cb) => {
    const filename = `avatar-${req.user.username}`;
    const extension = file.mimetype.split('/')[1];
    cb(null, `${filename}.${extension}`);
}

export const filterAvatar = (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
    }
}