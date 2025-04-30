Work in progress.

We'll want a script to create a new module at some point.
A prompt for that can include asking the name of the plugin, and that goes into package.json
Then probably copy from a template directory. Maybe that's the chat demo

If the configs and scripts could be shared by all plugins, that might be even better
Hide in a .config folder?

And there should be some kind of .env where you put your key(s) that gets gitignored
And a config for each module that maps it to an id
keys and ids both need to be per-environment

We can have a top-level config that lays out the different environments (dev/prod/local)
with urls for each

NEXT STEPS:

-   [x] Test the script locally and get it working with team-pickcode/my-api-key local chat-demo
-   [x] Clean up config files in chat demo, move them to hidden folder
-   [ ] Copy chat demo to template directory, make script for making new module
