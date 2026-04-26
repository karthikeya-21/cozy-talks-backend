import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Request } from "express";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const uploadsDirectory = join(process.cwd(), "uploads");

function ensureUploadsDirectory() {
  if (!existsSync(uploadsDirectory)) {
    mkdirSync(uploadsDirectory, { recursive: true });
  }
}

@UseGuards(JwtAuthGuard)
@Controller("uploads")
export class UploadsController {
  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          ensureUploadsDirectory();
          callback(null, uploadsDirectory);
        },
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          callback(new BadRequestException("Only image uploads are allowed."), false);
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException("Image file is required.");
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    return {
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
    };
  }
}
