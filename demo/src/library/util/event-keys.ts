import { KeyboardEvent } from 'react';

export class EventKeys {
    static isDelete = (event: KeyboardEvent) => {
        return event.keyCode === 46;
    };

    static isUp = (event: KeyboardEvent) => {
        return event.keyCode === 38;
    };

    static isDown = (event: KeyboardEvent) => {
        return event.keyCode === 40;
    };

    static isEscape = (event: KeyboardEvent) => {
        return event.keyCode === 27;
    };

    static isEnter = (event: KeyboardEvent) => {
        return event.keyCode === 13;
    };

    static isTab = (event: KeyboardEvent) => {
        return event.keyCode === 9;
    };

    static isAltS = (event: KeyboardEvent) => {
        return event.altKey && event.keyCode === 83;
    };

    static isAltB = (event: KeyboardEvent) => {
        return event.altKey && event.keyCode === 66;
    };
}
