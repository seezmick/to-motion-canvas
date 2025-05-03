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

	t.same(found, wanted);
	t.end();
});


t.test('renderImports works for custom components', async t => {
	const pathWrapper = Substitute.for<PathWrapper>();
	pathWrapper.relative('./src/generatedMarkup', './src/components/Rect.ts')
		.returns("../components/Rect.ts");

	const pathsFromProjectRoot: CustomComponentImportPaths = {
		Rect: './src/components/Rect.ts',
	}

	const renderPathRelativeTo = './src/generatedMarkup';
	const componentsUsed: string[] = ['Rect', 'Circle'];

	const componentImportPathsRenderer
		= new _ComponentImportPathsRenderer({ pathWrapper });

	const found = componentImportPathsRenderer.renderImports({
		pathsFromProjectRoot,
		renderPathRelativeTo,
		componentsUsed,
	});

	const wanted = [
		'import { Circle } from "@motion-canvas/2d";',
		'import { Rect } from "../components/Rect.ts";',
	];

	// start testing internal calls

	pathWrapper
		.received()
		.relative('./src/generatedMarkup', './src/components/Rect.ts');

	// end testing internal calls

	t.same(found, wanted);
	t.end();
});
