import { api } from "../../oauth";
import { AxiosInstance, AxiosResponse } from "axios";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import {
  APICommitPayload,
  APIGetCommitDiffParams,
  CommitDiffLines,
  QueryCommits,
} from "../types/commits_types";
import { TCommit, TCommitDiffParsed } from "../types/commits_types";
import { getNextPage, getNumberFromDiff } from "../utils";

class CommitsAPI {
  private API: AxiosInstance;
  private DEFAULT_LIST_PARAMS: QueryCommits & APIQueryParams;

  constructor(api: AxiosInstance) {
    this.API = api;

    this.DEFAULT_LIST_PARAMS = {
      ref_name: "master",
      with_stats: true,
      page: 1,
      per_page: API_ITEMS_PER_PAGE,
    };
  }

  /**
   * Get a list of repository commits in a project.
   */
  public listCommits(
    project_id: number,
    params: QueryCommits & APIQueryParams
  ): Promise<AxiosResponse<ResponseWithPage<TCommit[]>>> {
    return this.API.get(`/projects/${project_id}/repository/commits`, {
      params: {
        ...this.DEFAULT_LIST_PARAMS,
        ...params,
      },
    }).then((res) => {
      const next_page = getNextPage(res);
      const data: TCommit[] = res.data;
      res.data = {
        data,
        next_page,
      };
      return res;
    });
  }

  /**
   * Create a commit by posting a JSON payload
   */
  public commitMultipleFiles(project_id: number, payload: APICommitPayload) {
    return this.API.post(`/projects/${project_id}/repository/commits`, payload);
  }

  /**
   * Get the diff of a commit in a project.
   */
  public getCommitDiff(
    params: APIGetCommitDiffParams
  ): Promise<AxiosResponse<TCommitDiffParsed[]>> {
    return this.API.get(
      `/projects/${params.project_id}/repository/commits/${params.commit_sha}/diff`
    ).then((res: AxiosResponse<TCommitDiffParsed[]>) => {
      const data = res.data.map(
        (diff_data): TCommitDiffParsed => {
          let lines = diff_data.diff.trimEnd().split("\n");
          let lines_numbers = [0, 0, 0, 0, 0, 0];
          let max_line_number = 1;
          const diff_lines = lines.map((line, index) => {
            const type =
              line.startsWith("@@") ||
              line.startsWith("\\ No newline at end of file")
                ? "info"
                : line[0] === "+"
                ? "add"
                : line[0] === "-"
                ? "remove"
                : "neutro";

            let a_line_number: number | string = " ";
            let b_line_number: number | string = " ";

            if (line.startsWith("@@")) {
              const matches = getNumberFromDiff(line);

              lines_numbers = [
                ...matches,
                matches[0] + matches[1],
                matches[2] + matches[3],
              ];
              a_line_number = "...";
              b_line_number = "...";

              //get max line number
              max_line_number = Math.max(max_line_number, ...matches);
            } else if (type === "add") {
              a_line_number = " ";
              if (lines_numbers[2] < lines_numbers[5]) {
                b_line_number = lines_numbers[2];
                lines_numbers = lines_numbers.map((num, index) =>
                  index === 2 ? num + 1 : num
                );
              } else {
                b_line_number = " ";
              }
            } else if (type === "remove") {
              b_line_number = " ";
              if (lines_numbers[0] < lines_numbers[4]) {
                a_line_number = lines_numbers[0];
                lines_numbers = lines_numbers.map((num, index) =>
                  index === 0 ? num + 1 : num
                );
              } else {
                a_line_number = " ";
              }
            } else if (type === "neutro") {
              if (lines_numbers[0] < lines_numbers[4]) {
                a_line_number = lines_numbers[0];
              }
              if (lines_numbers[2] < lines_numbers[5]) {
                b_line_number = lines_numbers[2];
              }
              lines_numbers = lines_numbers.map((num, index) =>
                index === 0 || index === 2 ? num + 1 : num
              );
            }
            return {
              line,
              type,
              a_line_number,
              b_line_number,
            } as CommitDiffLines;
          });
          return {
            ...diff_data,
            diff_lines: diff_lines,
            max_line_number,
          };
        }
      );

      res.data = data;

      return res;
    });
  }
}

export default new CommitsAPI(api);
