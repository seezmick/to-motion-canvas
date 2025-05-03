import t from 'tap';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { PathWrapper } from '../wrappers/PathWrapper';
import { _ComponentImportPathsRenderer } from './ComponentImportPathsRenderer';
import { CustomComponentImportPaths } from '../mainConfig/MainConfigSchema';

t.test('renderImports works', async t => {
	const pathWrapper = Substitute.for<PathWrapper>();

	const pathsFromProjectRoot: CustomComponentImportPaths = {
	}

	const renderPathRelativeTo = './random/path';
	const componentsUsed: string[] = ['Rect'];

	const componentImportPathsRenderer
		= new _ComponentImportPathsRenderer({ pathWrapper });

	const found = componentImportPathsRenderer.renderImports({
		pathsFromProjectRoot,
		renderPathRelativeTo,
		componentsUsed,
	});

	const wanted = [
		'import { Rect } from "@motion-canvas/2d";',
	];

	t.equal(found, wanted);
	t.end();
});
