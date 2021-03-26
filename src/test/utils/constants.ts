export const FUNCTION_COMPONENT: string = `import React from 'react';

export default function Component() {
    return <div>Hellow World</div>;
}
`;

export const FUNCTION_EXPRESSION_COMPONENT: string = `import React from 'react';

const Component = () => {
    return <div>Hellow World</div>;
}

export default Component;
`;