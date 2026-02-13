# THINGS I LEARNT WHILE WORKING ON THIS

1. Vercel rewrites are resolved in the order they are defined. So the specific rewrite should be defined before the generic one.
   That's why my api rewrites were not working previously, cuz I defined the catch-all rewrite before the api rewrite.
