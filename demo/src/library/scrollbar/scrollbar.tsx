import { RefObject } from 'react';
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars';

export interface IScrollbarProps extends ScrollbarProps {
    ref?: RefObject<Scrollbars>
}

export const ScrollBar = ({
    ref,
    width,
    height,
    autoHeight,
    autoHeightMin,
    autoHeightMax,
    autoHide,
    allowTransparency,
    onScroll,
    onScrollStart,
    onScrollStop,
    onUpdate,
    style,
    ...props
}: IScrollbarProps) => {
    style = style || {};
    if (autoHeightMax) {
        style.maxHeight = autoHeightMax;
        if (!autoHeight && !height) {
            style.height = autoHeightMax;
        }
    }
    return (
        <Scrollbars
            ref={ref}
            width={width}
            height={height}
            autoHeight={autoHeight}
            autoHeightMin={autoHeightMin}
            autoHeightMax={autoHeightMax}
            autoHide={autoHide}
            allowTransparency={allowTransparency}
            onScroll={onScroll}
            onScrollStart={onScrollStart}
            onScrollStop={onScrollStop}
            onUpdate={onUpdate}
            style={style}
            {...props}
        />
    );
};
