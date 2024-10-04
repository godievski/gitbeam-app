import RNFS from "react-native-fs";
import { debug } from "./debug";

//constants
export const DEFAULT_ENCODING = "utf8";
export const DEFAULT_DIR = RNFS.DocumentDirectoryPath;
export const PREFIX_CHANGES = `changes`;

const fs = RNFS;

//utils
export const isDirectory = (filepath: string) => {
  return RNFS.stat(filepath).then((res) => res.isDirectory());
};

export const extractPathDir = (full_path: string) => {
  const subdirs = full_path.split("/");

  return subdirs.slice(0, subdirs.length - 1).join("/");
};

export const getRealPathChanges = (prefix: PrefixFile, full_path: string) => {
  if (full_path.length == 0) {
    return `${PREFIX_CHANGES}/${prefix.project_id}/${prefix.branch}`;
  } else {
    return `${PREFIX_CHANGES}/${prefix.project_id}/${prefix.branch}/${full_path}`;
  }
};

//api
export interface PrefixFile {
  project_id: string | number;
  branch: string;
}

export class FileSystemAPI {
  public async makeDir(path: string) {
    const subdirs = path.split("/");

    let i = 0;
    for (i = 0; i < subdirs.length; i++) {
      const new_dir = subdirs.slice(0, i + 1).join("/");
      const new_path = `${DEFAULT_DIR}/${new_dir}`;
      const exists = await fs.exists(new_path);
      if (!exists) {
        await fs.mkdir(new_path);
      } else {
        const isDir = await isDirectory(new_path);
        if (!isDir) {
          await fs.unlink(new_path);
          await fs.mkdir(new_path);
        }
      }
    }

    return true;
  }

  public async saveContent(
    prefix: PrefixFile,
    full_path: string,
    data: string
  ) {
    const real_full_path = getRealPathChanges(prefix, full_path);

    const exists = await fs.exists(`${DEFAULT_DIR}/${real_full_path}`);

    if (exists) {
      const isDir = await isDirectory(`${DEFAULT_DIR}/${real_full_path}`);

      if (isDir) {
        await fs.unlink(`${DEFAULT_DIR}/${real_full_path}`);
        await fs.writeFile(
          `${DEFAULT_DIR}/${real_full_path}`,
          data,
          DEFAULT_ENCODING
        );
      } else {
        return fs.writeFile(
          `${DEFAULT_DIR}/${real_full_path}`,
          data,
          DEFAULT_ENCODING
        );
      }
    } else {
      const full_dir_path = getRealPathChanges(
        prefix,
        extractPathDir(full_path)
      );

      const deep_dir_exists = await fs.exists(
        `${DEFAULT_DIR}/${full_dir_path}`
      );

      if (!deep_dir_exists) {
        await this.makeDir(full_dir_path);
      }

      await fs.writeFile(
        `${DEFAULT_DIR}/${real_full_path}`,
        data,
        DEFAULT_ENCODING
      );
    }
  }

  public readFile(prefix: PrefixFile, full_path: string): Promise<string> {
    return fs.readFile(
      `${DEFAULT_DIR}/${getRealPathChanges(prefix, full_path)}`,
      DEFAULT_ENCODING
    );
  }

  public deleteFile(prefix: PrefixFile, full_path: string): Promise<boolean> {
    return fs
      .unlink(`${DEFAULT_DIR}/${getRealPathChanges(prefix, full_path)}`)
      .then(() => true)
      .catch(() => false);
  }

  public deleteFilesBranch(prefix: PrefixFile): Promise<boolean> {
    return fs
      .unlink(`${DEFAULT_DIR}/${getRealPathChanges(prefix, "")}`)
      .then(() => true)
      .catch(() => false);
  }

  public async deleteAllFiles() {
    const path = `${DEFAULT_DIR}/${PREFIX_CHANGES}`;
    try {
      const exists = await fs.exists(path);
      if (exists) {
        fs.unlink(path);
      }
    } catch (e) {
      debug && console.log(e);
      throw e;
    }

    return true;
  }
}

export default new FileSystemAPI();
