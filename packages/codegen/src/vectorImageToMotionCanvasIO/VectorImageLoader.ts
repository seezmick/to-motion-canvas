import { PathLike } from "fs";
import { VectorImage } from "@to-motion-canvas/utilities";
import { FsWrapper, initFsWrapper } from "../wrappers/FsWrapper";
import { initInkscapeSVGParser, InkscapeSVGParser } from "@to-motion-canvas/inkscape-svg";

export interface VectorImageLoader {
  load(inputFilePath: PathLike): Promise<VectorImage>;
}

export class _VectorImageLoader implements VectorImageLoader {
  constructor(public deps: {
    fs: FsWrapper,
    inkscapeSVGParser: InkscapeSVGParser,
  }) { }

  async load(inputFilePath: PathLike): Promise<VectorImage> {
    const svgContent = await this.deps.fs.readFile(inputFilePath);
    const inkscapeSVG = this.deps.inkscapeSVGParser.parse(svgContent);
    return inkscapeSVG;
  }
}

export type InitVectorImageLoaderFn = () => VectorImageLoader;

export const initVectorImageLoader = () => new _VectorImageLoader({
  fs: initFsWrapper(),
  inkscapeSVGParser: initInkscapeSVGParser(),
});
