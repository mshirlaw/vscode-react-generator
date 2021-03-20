export const COMPONENT_FILE_TEMPLATE = `import React from 'react';
import styles from './Component.module.css';

function Component(): JSX.Element {
  return <div></div>;
}

export default Component;
`;

export const MODULE_FILE_TEMPLATE = ``;

export const SPEC_FILE_TEMPLATE = `import React from "react";
import { screen, render } from "@testing-library/react";

import Component from './Component';

describe("Test", () => {
  test("it should", () => {
    render(<Component />);
  });
});
`;