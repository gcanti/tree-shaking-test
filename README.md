# all

```bash
npx tsc && npx rollup -c ./rollup.config.js && npx prettier --write ./target/rollup.js && npx webpack && npx prettier --write ./target/webpack.js
```

# webpack only

stats

```bash
npx webpack --profile --json > stats.json
```

analyzer

```bash
npx webpack-bundle-analyzer stats.json
```
