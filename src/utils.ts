import * as vscode from 'vscode';
import { WorkspaceConfiguration } from 'vscode';
import { Config } from './types/config';
 
function getWorkspaceConfig(): WorkspaceConfiguration {
    const config: WorkspaceConfiguration = vscode.workspace.getConfiguration('vscode-react-generator');
    return config;
}

/**
 * 
 * Retrieves config from workspace and applies default values
 * 
 * @returns {@link Config} the config object
 */
export function getConfigWithDefaults(): Config {
    const { 
        testFile = { extension: 'js', suffix: 'spec' }, 
        componentFile = { extension: 'js' },
        componentGeneration = { includeCssModule: true, includeTestFile: true },
    } = getWorkspaceConfig();
    return { testFile, componentFile, componentGeneration } as Config;
}