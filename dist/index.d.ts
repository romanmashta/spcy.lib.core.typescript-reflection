import ts from 'typescript';
import { MetaInfo } from './meta-data';
export declare const transform: (files: string[], program: ts.Program) => MetaInfo;
export declare const generateMetaInfoForFiles: (files: string[], options: ts.CompilerOptions) => MetaInfo;
export declare const generateMetaInfoForFile: (file: string, options?: ts.CompilerOptions) => MetaInfo;
