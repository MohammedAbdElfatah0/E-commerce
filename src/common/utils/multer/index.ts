
// import { BadRequestException } from '@nestjs/common';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { v4 as uuidv4 } from "uuid"
// export const multerStorage: MulterOptions = {
//     storage: diskStorage(
//         {
//             destination: './upload',
//             filename: (req, file, callback) => {
//                 const unique = uuidv4();
//                 const fileEx = extname(file.originalname);
//                 const finalName = `${unique}${fileEx}`;
//                 callback(null, finalName);
//             }
//         }

//     ),

//     limits: {
//         fileSize: 5 * 1024 * 1024,
//     },
//     fileFilter: (req, file, callback) => {
//         const allowedTypes = /jpeg|jpg|png|gif/;
//         const mimeTypes = allowedTypes.test(file.mimetype);
//         const ext = allowedTypes.test(extname(file.originalname).toLowerCase());
//         if (mimeTypes && ext) {
//             return callback(null, true);
//         }
//         //
//         callback(new BadRequestException("Only images are allowed (jpeg, jpg, png, gif)"), false);
//     }
// };
