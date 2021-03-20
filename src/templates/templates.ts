import { Config } from "../types/Config";
import { getConfig } from "../utils";

/**
 * Returns a simple react component template
 * 
 * @param component {@link string} the name of the component
 * @returns {@link string} component template
 */
export function getComponentFileTemplate(component?: string): string {
  if (!component) {
    component = 'Component';
  }
  
  const config: Config = getConfig();
  const returnValue = config.componentFile.extension.match(/ts[x]?$/) ? ': JSX.Element': '';

  return `import React from "react";
import styles from "./${component}.module.css";

function ${component}()${returnValue} {
  return <div></div>;
}

export default ${component};
`;
}

/**
 * Returns an empty CSS module file
 * 
 * @returns {@link string}
 */
export function getCssModuleFileTemplate(): string {
  return '';
};

/**
 * Returns a sample spec file which imports @testing-library/react
 * 
 * @param component {@link string} the name of the component
 * @returns {@link string}
 */
export function getTestingLibraryTemplate(component?: string): string {
  if (!component) {
    component = 'Component';
  }
  return `import React from "react";
import { render } from "@testing-library/react";

import ${component} from "./${component}";

describe("<${component} />", () => {
  test("it should render correctly", () => {
    render(<${component} />);
  });
});
`;
}