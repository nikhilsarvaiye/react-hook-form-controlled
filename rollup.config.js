import json from '@rollup/plugin-json';
import sass from 'rollup-plugin-sass';
import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import generatePackageJson from 'rollup-plugin-generate-package-json';

// import _package from './package.json'; // instead of '@rollup/plugin-json
// _package.main -> refers to 'main' entry in package.json file

export default {
    input: 'src/index.ts',
    plugins: [
        json(),
        sass({ insert: true }),
        typescript(),
        sourcemaps(),
        generatePackageJson({
            baseContents: (pkg) => ({
                ...pkg,
                dependencies: {},
                devDependencies: {},
                scripts: {},
            }),
        }),
    ],
    output: [
        {
            dir: 'dist',
            format: 'cjs',
            sourcemap: true,
            strict: false,
            exports: 'named',
        },
    ],
    external: ['react', 'react-dom'],
};
