import { tagRepository } from "../repositories";
import { TagDomain } from "../types";

export class TagService {
  async getTags(): Promise<TagDomain[]> {
    return tagRepository.findAll();
  }
}

export const tagService = new TagService();
