module.exports = {
    plugins: [
        require("postcss-import"),
        require("postcss-ts-classnames")({
            dest: "src/classnames.d.ts",
        }),
    ],
}