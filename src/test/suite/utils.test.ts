import * as sinon from 'sinon';
import * as assert from 'assert';
import { window, workspace } from 'vscode';
import { afterEach } from 'mocha';

import { Config } from '../../types/config';
import { getConfigWithDefaults } from '../../utils';

suite('Utils Test Suite', () => {
	window.showInformationMessage('Start utils tests');

	afterEach(() => {
		sinon.restore();
	});

	test('should return default config', async () => {
		const config = sinon.fake.returns({});
		sinon.replace(workspace, "getConfiguration", config);
		const expectedConfig: Config = {
			testFile: { extension: 'js', suffix: 'spec' }, 
			componentFile: { extension: 'js' },
			componentGeneration: { includeCssModule: true, includeTestFile: true },
		};
		assert.deepStrictEqual(getConfigWithDefaults(), expectedConfig);
	});

	test('should return correct config when testFile is set', async () => {
		const config = sinon.fake.returns({
			testFile: { extension: 'ts', suffix: 'test' }
		});
		sinon.replace(workspace, "getConfiguration", config);
		const expectedConfig: Config = {
			testFile: { extension: 'ts', suffix: 'test' }, 
			componentFile: { extension: 'js' },
			componentGeneration: { includeCssModule: true, includeTestFile: true },
		};
		assert.deepStrictEqual(getConfigWithDefaults(), expectedConfig);
	});

	test('should return correct config when componentFile is set', async () => {
		const config = sinon.fake.returns({
			testFile: { extension: 'ts', suffix: 'test' },
			componentFile: { extension: 'tsx'}
		});
		sinon.replace(workspace, "getConfiguration", config);
		const expectedConfig: Config = {
			testFile: { extension: 'ts', suffix: 'test' }, 
			componentFile: { extension: 'tsx' },
			componentGeneration: { includeCssModule: true, includeTestFile: true },
		};
		assert.deepStrictEqual(getConfigWithDefaults(), expectedConfig);
	});

	test('should return correct config when componentGeneration is set', async () => {
		const config = sinon.fake.returns({
			testFile: { extension: 'ts', suffix: 'test' },
			componentFile: { extension: 'tsx'},
			componentGeneration: { includeCssModule: false, includeTestFile: false },
		});
		sinon.replace(workspace, "getConfiguration", config);
		const expectedConfig: Config = {
			testFile: { extension: 'ts', suffix: 'test' }, 
			componentFile: { extension: 'tsx' },
			componentGeneration: { includeCssModule: false, includeTestFile: false },
		};
		assert.deepStrictEqual(getConfigWithDefaults(), expectedConfig);
	});
});
