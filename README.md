<h1 align="center">
  Gettlr 
</h1>

<p align="center" ><strong>A Markdown Editor for mostly me</strong>.</p>


<p align="center">
  <a href="https://github.com/Zettlr/Zettlr" target="_blank">Forked from Zettlr</a> |
  <a href="https://www.patreon.com/Zettlr" target="_blank">Support the original project</a>
</p>


Gettlr is my own personal adaptation of a great note-taking app, [Zettlr](https://www.Zettlr.com/). I've created this for **my own personal use**, and to try out javascript and electron.

Feel free to use this! Two things:

- I'd suggest looking at the original Zettlr, as it's much more stable and maintained.
- I probably won't respond to requests/issues.

## Usage

```bash
$ git clone https://github.com/thomaskoppelaar/Gettlr.git
$ cd Gettlr
$ npm install # Or yarn install
$ cd source
$ npm install # Or yarn install
```

_(Please note the second `yarn install`/`npm install` in the source directory. This is necessary to build the app locally.)_

Gettlr includes two extra commands on top of the commands listed below, to make your life easier when editing/running this app.
```bash
$ npm run tk-reload # recompiles everything: See below for more details
$ npm run tk-start # recompiles everything, and starts the application.
                    # does the same as npm run tk-reload && npm run start
```

These four scripts handle all different components for the app.

```bash
$ npm run less # This recompiles the stylesheets
$ npm run handlebars # This recompiles the templates
$ npm run wp:dev # This recompiles the Vue components
$ npm run reveal:build # Needs to be run once, recompiles reveal.js components
```

Another useful command is `npm run start`, which you can use to start the application once everything has been installed and compiled at least once.

## License

This software is licensed via the GNU GPL v3-License.

