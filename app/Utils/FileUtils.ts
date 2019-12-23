import fs from "fs";

export default abstract class FileUtils {
    // Gets absolute paths of all files in directory and all recursive subdirectories
    public static walkDir (dirPath: string): string[] {
        let files: (fs.Dirent | string)[] = fs.readdirSync(dirPath, { withFileTypes: true });

        for (let i = files.length - 1; i >= 0; i--) {
            let f = files[i] as fs.Dirent;

            //recurse over subdirectories
            if (f.isDirectory())
                files.splice(i, 1, ...this.walkDir(dirPath + "/" + f.name));

            //converts fs.Dirent files to properly formatted absolute paths (string)
            else files[i] = require.resolve(dirPath + "/" + f.name);
        }

        return files as string[];
    }
}
