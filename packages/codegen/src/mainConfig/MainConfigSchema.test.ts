import t from 'tap';
import { _MainConfigSchema, MainConfig } from './MainConfigSchema';

t.test('parse correctly parses a MainConfig', t => {
  const mainConfigSchema = new _MainConfigSchema();

  const mainConfig = {
    vectorImages: [
      {
        input: {
          filePath: "./circles_1920_by_1080.svg",
        },
        output: {
          directoryPath: "./src/vectorImageGenerated",
          viewAdderFunctionName: 'circles1920By1080',
          customComponentImportPaths: {
            Rect: "./src/components/Rect.ts",
          }
        }
      },
      {
        input: {
          filePath: "./rects_1920_by_1080.svg",
        },
        output: {
          directoryPath: "./src/vectorImageGenerated",
          viewAdderFunctionName: 'rects1920By1080',
          customComponentImportPaths: {
          }
        }
      },
      {
        input: {
          filePath: "./rects_1920_by_1080.svg",
        },
        output: {
          directoryPath: "./src/vectorImageGenerated",
          viewAdderFunctionName: 'rects1920By1080',
        }
      },
    ]
  } as MainConfig;

  const found = mainConfigSchema.parse(mainConfig);
  const wanted = { ...mainConfig };

  t.same(found, wanted);

  t.end()
});

