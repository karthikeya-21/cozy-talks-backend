import { Request } from "express";
export declare class UploadsController {
    uploadImage(file: Express.Multer.File, req: Request): {
        url: string;
        filename: string;
    };
}
