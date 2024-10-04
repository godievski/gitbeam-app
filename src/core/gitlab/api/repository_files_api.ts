import { api } from "../../oauth";
import { AxiosInstance } from "axios";
import base64 from "hi-base64";
import mime from "mime-types";
import {
  TFile,
  FileContentType,
  NewFileData,
} from "../types/repository_files_types";

//text file limit
export const TEXT_FILE_LIMIT = 1024 * 1024;

class RepositoryFileAPI {
  private API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  /**
   * Allows you to receive information about file in repository like name, size, content.
   * Note that file content is Base64 encoded.
   * This endpoint can be accessed without authentication
   * if the repository is publicly accessible.
   */

  public getFileFromRepository(
    project_id: number,
    file_path: string,
    ref: string
  ) {
    const file_path_encoded = encodeURIComponent(file_path);
    const ref_encoded = encodeURIComponent(ref);
    return this.API.get<TFile>(
      `/projects/${project_id}/repository/files/${file_path_encoded}?ref=${ref_encoded}`
    ).then((res) => {
      let item = res.data;
      let content_encoding = res.headers["content-encoding"] ?? "text";
      let type: FileContentType = "other";
      let content_decoded: any = null;

      if (content_encoding == "text") {
        try {
          content_decoded = base64.decode(item.content);
          type = "text";
        } catch (e) {
          content_decoded = null;
        }
      } else if (
        content_encoding == "gzip" ||
        content_encoding == "br" ||
        content_encoding == "rb"
      ) {
        const contentType = mime.lookup(res.data.file_name) || "";

        if (contentType.includes("image/")) {
          content_decoded = `data:${contentType};base64,${item.content}`;
          type = "image";
        } else if (item.size <= TEXT_FILE_LIMIT) {
          try {
            content_encoding = "text";
            content_decoded = base64.decode(item.content);
            type = "text";
          } catch (e) {
            content_decoded = null;
          }
        }
      }

      item.content_encoding = content_encoding;
      item.content_decoded = content_decoded;
      item.type = type;

      return item;
    });
  }

  /**
   * This allows you to create a single file.
   */
  public createFile = (
    project_id: number,
    file_path_encoded: string,
    data: NewFileData
  ) => {
    return this.API.post(
      `/projects/${project_id}/repository/files/${file_path_encoded}`,
      data
    );
  };
}

export default new RepositoryFileAPI(api);
