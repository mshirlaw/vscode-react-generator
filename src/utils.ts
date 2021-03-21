import * as vscode from 'vscode';
import { WorkspaceConfiguration } from 'vscode';
import { Config } from './types/config';

/**
 * Retrieves config from workspace and applies default values
 * 
 * @returns {@link Config} the config object
 */
export function getConfig(): Config {
	const config: WorkspaceConfiguration = vscode.workspace.getConfiguration('vscode-react-generator');
    const { 
        testFile = { extension: 'js', suffix: 'spec' }, 
        componentFile = { extension: 'js' },
        componentGeneration = { includeCssModule: true, includeTestFile: true },
    } = config;
    return { testFile, componentFile, componentGeneration } as Config;
}