```bash
npx webpack && npx prettier --write ./target/webpack.js
# Inspect output
code ./target/webpack.js
```

```bash
npx rollup -c ./rollup.config.js
# Inspect output
code ./target/rollup.js
```

```bash
npx tsc && npx rollup -c ./rollup.config.js && npx webpack && npx prettier --write ./target/webpack.js
```
