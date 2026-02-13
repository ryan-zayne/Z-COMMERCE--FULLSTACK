# THINGS I LEARNT WHILE WORKING ON THIS AND MAKING ALIASES WORK IN PROD

1. Simply ensure that your tsconfig is fully readable by tsx, meaning `@zayne-labs/tsconfig` for example should be in your dependencies not dev dependencies to avoid it being skipped in prod.
