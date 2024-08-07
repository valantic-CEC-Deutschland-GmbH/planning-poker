import { HTMLInputAutoCompleteAttribute, ReactNode, SetStateAction } from "react";

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password'
}

export interface InputInterface {
    type: InputType;
    placeholder: string;
    icon: ReactNode;
    autocomplete?: HTMLInputAutoCompleteAttribute;
    setter: (value: SetStateAction<string>) => void;
    className?: string;
}