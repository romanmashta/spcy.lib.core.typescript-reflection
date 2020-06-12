import ts from 'typescript';
import { MetaInfo } from '@spcy/lib.core.reflection';
export declare const generateMetaInfoForFiles: (files: string[], options: ts.CompilerOptions) => MetaInfo;
export declare const generateMetaInfoForFile: (file: string, options?: ts.CompilerOptions) => MetaInfo;
