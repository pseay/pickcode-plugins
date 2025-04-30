Run `pnpm i` and then `pnpm run init-module` to create your first module.

cd to the new module's directory and run `pnpm i` to get started.

Whenever you want to push up your changes, run `pnpm run build` from your module directory
and then `pnpm run update-module [local/dev/prod] [--branch branchName]`
(depending on the environment and branch you want to use)
