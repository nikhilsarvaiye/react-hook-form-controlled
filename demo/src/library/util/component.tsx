import { cloneElement, Fragment } from 'react';

export const RenderChildrenAsFunctionChild = (children: any, props?: any) => {
    props = props || {};
    return children
        ? typeof children === 'function'
            ? children(props)
            : Array.isArray(children)
            ? children.map((child, index) => {
                  return renderChild(props, child, index);
              })
            : renderChild(props, children)
        : null;
};

const renderChild = (props: any, child: any, key?: any) => {
    let cloneChild = cloneElement(child, ...props);
    return <Fragment key={key}>{cloneChild}</Fragment>;
};
