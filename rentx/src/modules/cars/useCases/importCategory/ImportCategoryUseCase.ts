import csvParse from "csv-parse";
import fs from "fs";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IImportCategorie {
  name: string;
  description: string;
}

class ImportCategoryUseCase {
  constructor(private categoriesRepositories: ICategoriesRepository) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategorie[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const categories: IImportCategorie[] = [];

      const parseFile = csvParse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [name, description] = line;
          categories.push({
            name,
            description,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(categories);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async (category) => {
      const { name, description } = category;

      const existsCategory = this.categoriesRepositories.findByName(name);

      if (!existsCategory) {
        this.categoriesRepositories.create({
          name,
          description,
        });
      }
    });
  }
}

export { ImportCategoryUseCase };
