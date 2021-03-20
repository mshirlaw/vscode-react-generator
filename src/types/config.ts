/**
 * Interface for {@link FileConfig}
 */
 declare interface FileConfig {
    extension: string,
}

/**
 * Interface for {@link TestFileConfig}
 */
 declare interface TestFileConfig extends FileConfig{
    suffix: string
}

/**
 * Interface for {@link ComponentGenerationConfig}
 */
declare interface ComponentGenerationConfig {
    includeCssModule: boolean;
    includeTestFile: boolean;
}

/**
 * Interface for application {@link Config}
 */
export declare interface Config {
    componentFile: FileConfig;
    componentGeneration: ComponentGenerationConfig;
    testFile: TestFileConfig;
}