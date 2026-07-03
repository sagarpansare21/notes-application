import { tagService } from "../services";
import { successResponse } from "../utils";

export class TagController {
  async getTags(request: any, reply: any) {
    const tags = await tagService.getTags();
    return reply.status(200).send(successResponse("Tags retrieved successfully", tags));
  }
}

export const tagController = new TagController();
