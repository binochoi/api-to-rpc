import path from 'path'
import { extendsRouting } from 'nitro-extends-routing'
export default defineNitroConfig({
    srcDir: "src",
    alias: {
        'server': path.resolve(__dirname, '../../monolithic'),
    },
    modules: [
        extendsRouting({
            routePath: path.resolve(__dirname, './routes'),
            prefix: 'hello-world'
        }),
    ],
    typescript: {
        tsConfig: {
            compilerOptions: {
                strict: true,
            },
            include: ['./global.d.ts'],
        }
    },
})