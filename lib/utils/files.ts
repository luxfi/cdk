import * as fs from "fs";
import * as path from "path";

export interface FileOptions {
  matching: (s: string) => boolean;
  encoding: string | null;
}

const defaultOptions: FileOptions = {
  matching: (_: string) => true,
  encoding: "utf-8",
};

export const fileMap = (
  filePath: string,
  _options: FileOptions = defaultOptions
): { [key: string]: string } => {
  const key = path.basename(filePath, "");
  const value = fs.readFileSync(filePath, { encoding: "utf-8" });
  return { [key]: value };
};

export const directoryFiles = (
  filePath: string,
  _options: FileOptions = defaultOptions
): string[] => {
  const dir = fs.readdirSync(filePath);
  const files: string[] = (dir || []).reduce(
    (acc: string[], relativePath: string) => {
      const absPath = path.join(filePath, relativePath);
      const stat = fs.lstatSync(absPath);

      return acc.concat(stat.isDirectory() ? directoryFiles(absPath) : absPath);
    },
    []
  );
  return files;
};

export const directoryMap = (
  filePath: string,
  options: FileOptions = defaultOptions
): { [key: string]: string } => {
  const fileArray = directoryFiles(filePath, options);
  return fileArray.reduce((acc: any, absPath: string) => {
    const singleFileMap = fileMap(absPath, options);
    return { ...acc, ...singleFileMap };
  }, {});
};
