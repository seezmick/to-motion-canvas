import myzod, { Infer } from 'myzod';
import { ObjectOptions, PathOptions } from 'myzod/libs/types';

const isTsFilepath
  = (value: string) => /^(.+)\/([^\/]+)\.ts$/gm.test(value);
const TS_FILEPATH_REQUIRED
  = 'string must be a valid path to an ".ts" file';

const customComponentImportPathsSchema = myzod.object({
  Rect: myzod.string()
    .withPredicate(isTsFilepath, TS_FILEPATH_REQUIRED).optional(),
}).optional();

const vectorImageSchema = myzod.object({
  input: myzod.object({
    filePath: myzod.string()
      .withPredicate(value => /^(.+)\/([^\/]+)\.svg$/gm.test(value),
        'string must be a valid path to an ".svg" file'),
  }),
  output: myzod.object({
    viewAdderFunctionName: myzod.string()
      .withPredicate(value => /^[$A-Za-z_]?[$0-9A-Za-z_]*$/gm.test(value),
        'string must be a valid function name'),
    directoryPath: myzod.string()
      .withPredicate(value => /^(.+)\/([^\/]+)$/gm.test(value),
        'string must be a directory path'),
    customComponentImportPaths: customComponentImportPathsSchema,
  }),
});

const mainConfigSchema = myzod.object({
  vectorImages: myzod.array(vectorImageSchema),
});

export type CustomComponentImportPaths = Infer<typeof customComponentImportPathsSchema>;
// TODO: rename to VectorImageConfig
export type InkscapeSVGConfig = Infer<typeof vectorImageSchema>;
export type MainConfig = Infer<typeof mainConfigSchema>;

export interface MainConfigSchema {
  parse(value?: unknown,
    parseOpts?: ObjectOptions<any> & PathOptions): MainConfig;
}

export class _MainConfigSchema implements MainConfigSchema {
  parse(value?: unknown,
    parseOpts?: ObjectOptions<any> & PathOptions): MainConfig {
    return mainConfigSchema.parse(value, parseOpts);
  }
}

export function initMainConfigSchema(): MainConfigSchema {
  return new _MainConfigSchema();
}
