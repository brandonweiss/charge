<h1 align="center">
  <br>
  <img src="media/logomark.svg?sanitize=true" width="300px" alt="Charge">
  <br>
  <br>
  Charge
  <br>
  <br>
</h1>

[![](https://badgen.net/travis/brandonweiss/charge?icon=travis)](https://www.travis-ci.com/brandonweiss/charge)
[![](https://badgen.net/npm/v/@static/charge?icon=npm)](https://www.npmjs.com/package/@static/charge)
![](https://badgen.net/npm/node/@static/charge)
[![](https://badgen.net/david/dep/brandonweiss/charge)](https://david-dm.org/brandonweiss/charge)
![](https://badgen.net/badge/documentation/lit/purple)

### What?

Charge is an opinionated, zero-config static site generator written in JavaScript. It supports a wide variety of common uses and it does it without needing to be configured or customized. It’s fast, it’s simple, and it works the way you probably expect it to. That’s it.

### Why?

Yeah, I know, another static site generator. Let me be clear, I really did not want to make a static site generator. It’s really the very last thing I wanted to do.

I went on [StaticGen][static-gen] and looked at every JavaScript-based one. I could not find a single one that I thought was simple, well-documented, had the features I needed, was actively maintained, and was designed and worked the way I wanted. So here I am, making a static site generator.

### Highlights

- Zero configuration
- Templating via [JSX][jsx] and [MDX][mdx]
- Write futuristic JavaScript with [Babel][babel]
- Write futuristic CSS with [PostCSS][postcss]
- Live-reloading development server
- Rebuilds the minimum files necessary
- Dynamic pages (coming soon)
- Stellar documentation ✨

## Installation

Install it globally:

```shell
❯ npm install --global @static/charge
```

```shell
❯ yarn global add @static/charge
```

Or add it to your application’s `package.json`:

```shell
❯ npm install --save-dev @static/charge
```

```shell
❯ yarn add --dev @static/charge
```

**NB**: The “charge” package on NPM is _not_ this package. You must use the scoped package name “@static/charge”.

## Usage

There are only two commands: `serve` and `build`.

### Serve

Running `serve` will start a live-reloading development server for local development. You run it with:

```shell
❯ charge serve <source directory>
```

`<source directory>` is the directory that contains the files you want to be built to become your static site.

They’ll be automatically built to `tmp/target`. You might want to add `tmp/target` to your `.gitignore` file or however you exclude files from version control.

#### Script

Rather than running `charge serve <source directory>` over and over again, consider adding the following to your `package.json` file.

```json
{
  "scripts": {
    "start": "charge serve source"
  }
}
```

Then run it with `npm start` or `yarn start`.

#### Live-reloading

Charge uses the popular [Browsersync][browsersync] library to handle live-reloading. Unfortunately, the documentation is not particularly clear about the details of how live-reloading works or what to expect. Here’s how I think it works:

If a stylesheet changes it will be live-reloaded. That is, it will be injected into the page without a full-page refresh. If an image changes it will also be live-reloaded.

If a JavaScript file changes it will do a full-page refresh. If an HTML file changes it will also do a full-page refresh. Basically, if anything other than a stylesheet or image changes it will do a full-page refresh.

If you encounter a file type that doesn’t appear to reload how you would expect, open an issue!

### Build

Running `build` will do a single build of your static site to create files to be deployed to production. You run it with:

```shell
❯ charge build <source directory> <target directory>
```

`<source directory>` is the directory that contains the files you want to be built to become your static site and `<target directory>` is the directory you want the static site to end up in.

#### Script

Rather than running `charge build <source directory> <target directory>` over and over again, consider adding the following to your `package.json` file.

```json
{
  "scripts": {
    "deploy": "charge build source target && <deploy command here>"
  }
}
```

Then run it with `npm run deploy` or `yarn deploy`.

## Building

How your files are handled depends on what type of file it is. Most files will simply be copied from `source` to `target` without being changed at all. Templates, JavaScripts, and stylesheets will be processed and then written to the `target` directory.

### Entrypoints

Many build systems or asset pipelines have a concept of “entrypoints” or “bundles”. You configure the build system to take many files from different sources and combine them together into one file, which is then referenced in your HTML. For a simple website there might be one bundle for your JavaScript and one bundle for your stylesheet. For a more complex website there might be multiple bundles of each type.

Charge doesn’t really have this concept, or at least there isn’t any configuration around it. Every file is potentially a “bundle” and how files should be combined together is automatically inferred by figuring out what is a “dependency”.

### Dependencies

A dependency is any file that is imported into another file. Let’s use JavaScript files as an example.

If you have `index.js` and `dependency.js` and they don’t reference each other in any way, then they will both be copied over and show up in the `target` directory. But if `index.js` imports `dependency.js`, then `dependency.js` is inferred to be a dependency, which means it will be treated differently in two ways:

1.  `dependency.js` will be bundled/included into `index.js`
2.  `dependency.js` will not be copied over into the `target` directory

This should probably be what you would expect to happen. It should fit your mental model of how build systems work. The only difference here is that other systems require you to explicitly configure what is an “entrypoint” and what is a dependency, whereas Charge analyzes the files to automatically figure this out for you.

## Templates

Templating is done via React, [JSX][jsx], and [MDX][mdx]. If you’re used to thinking about React running in the browser, this is different. These templates are server-side rendered not client-side rendered, meaning React is used to generate static HTML files.

The naming convention is `name.html.jsx` for JSX files and `name.html.mdx` for MDX files. When the site is built the `.jsx` and `.mdx` extensions will be removed.

### Clean URLs

Clean URLs, or ”Directory Indexes” as they were more commonly called in the old days is a way of structuring static files such that the extensions don’t show in the URL.

For example, if you had a file `projects.html` you might expect the URL to look like `domain.com/projects.html`. The extension in the URL helps you know what type of file is at the URL, be it JavaScript, a stylesheet, or anything else. But, for a variety of reasons, when it comes to HTML the extension has become unnecessary. If you see a URL like `domain.com/projects` everyone now understands that an HTML file will be returned; the `.html` is implied.

To make this work, HTML files will have their paths rewritten slightly. Nothing will happen to the `index.html` file at the root of the `source` directory, but a file named `projects.html` will become `projects/index.html`. When someone visit `domain.com/projects` the `projects/index.html` file will be returned.

Wherever you’re hosting your static site will almost certainly support clean URLs.

### Components

React is a component-based system, so if you’re looking for the concept of “partials”, components are them.

```javascript
// index.html.jsx
import Component from "./component.html.jsx"

export default () => {
  return (
    <div>
      <Component message="Hello!">
    </div>
  )
}
```

```javascript
// component.html.jsx
export default (props) => {
  return <p>{props.message}</p>
}
```

### Layouts

Layouts are just another way of using React components. Wrap a component around your content and use the `children` property to render the content.

```javascript
// index.html.jsx
import Layout from "./layout.html.jsx"

export default () => {
  return (
    <Layout>
      <p>Hello!</p>
    </Layout>
  )
}
```

```javascript
// layout.html.jsx
export default (props) => {
  return (
    <html>
      <head>
      </head>

      <body>
        {props.children}
      </body>
    </html>
  )
}
```

### Markdown

Markdown is handled via [MDX][mdx], a clever idea for combining Markdown and [JSX][jsx]. It’s best to read the docs, but you can…

* Import Markdown into JSX
* Import JSX into Markdown
* Import Markdown into Markdown

MDX is not the same as JSX, though. For example, there are no expressions. There isn’t a render function either, so there are no props. There are layouts, though.

The default `export` from an MDX file can be used to provide a layout component that will wrap the Markdown.

```javascript
// index.html.mdx
import Layout from "./layout.html.jsx"

export default default ({ children }) => <Layout title="Title">{children}</Layout>

# Heading
```

```javascript
// layout.html.jsx
export default (props) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
      </head>

      <body>
        {props.children}
      </body>
    </html>
  )
}
```

### SVGs

If you want to inline an SVG it will be automagically turned into a React component if you import it.

```javascript
// index.html.jsx
import Icon from "./icon.svg"

export default () => {
  return <div>
  <h1>Heading</h1>

  <Icon />
  </div>
}
```

It will be wrapped in a `<span>`, so the markup will look like this.

```html
<div>
  <h1>Heading</h1>

  <span>
    <svg>…</svg>
  </span>
</div>
```

Also keep in mind that when you import an SVG it becomes a dependency and thus will not be copied over into the `target` folder. That means you can either use an SVG as an image (`<img src="path/to/icon.svg" />`) or inline it by importing it, but not both.

### Props

A set of `props` will be passed to your templates. The object looks like this:

```javascript
{
  data: {},
  environment: "development",
}
```

The `data` property will be populated with any data files you create. The section on [data files](#data-files) will explain them.

The `environment` property will be either `"development"` or `"production"`, depending on whether you run `serve` or `build`, respectively.

### Organization

If you find that you have a lot of layouts and/or components you can organize them into folders. There are no constraints on how you decide to organize your dependencies.

### Doctype

JSX does not support the DOCTYPE declaration used at the top of HTML documents. Just leave it off and it will be prepended to the top of all JSX and MDX files for you.

### Whitespace

JSX eats whitespace. If you break a line of HTML onto two lines in any other templating language there would be a space between them in the output.

```html
<p>
  These should appear on the same
  line with a space between them.
</p>
```

But with JSX they won’t. You’ll need to intentionally insert a space like this.

```html
<p>
  These will be on the same line
  {" "}
  with a space between them.
</p>
```

### Importing React

When using JSX you would normally need to import React just like any other module, both with stateful and stateless components.

```javascript
// Stateful component
import React from "react" // React import is required

export default class extends React.Component {
  render() {
    return <div />
  }
}
```

```javascript
// Stateless component
import React from "react" // React import is required

export default () => {
  return <div />
}
```

Charge automatically prepends the import to JSX files for you so you don’t have to.

```javascript
// Stateful component
// No React import necessary

export default class extends React.Component {
  render() {
    return <div />
  }
}
```

```javascript
// Stateless component
// No React import necessary

export default () => {
  return <div />
}
```

## Stylesheets

Stylesheets are not preprocessed. There is no Sass, Stylus, or alternative CSS syntax. You write normal CSS. You can take advantage of new CSS features that don’t have universal browser support via [PostCSS][postcss]. Much of what you might have used a preprocessor for you can do with PostCSS now. If you can’t do it with PostCSS then my opinion is you probably shouldn’t be doing it.

### Features

All Stage 2 and Stage 3 features are enabled. You can see a list of those features in [cssdb][cssdb]. Stage 1 features are considered too experimental to use. The one exception is [Custom Media Queries][custom-media-queries] which is very widely used and seems likely to progress to Stage 2, so that feature is also enabled.

### Importing

You can import other stylesheets using the `@import` at-rule.

```css
/* index.css */
@import "./other.css"

p {
  font-size: 16px;
}
```

```css
/* other.css */
a {
  font-size: 16px;
}
```

Imported stylesheets will be treated as dependencies and inlined into the files that import them.

Make sure you reference dependencies relatively with `./` or `../` to ensure they’re treated as dependencies.

#### NPM packages

You can `import` NPM packages as you would normally expect. It will look for packages in the `node_modules` folder at the root of your project.

## JavaScripts

JavaScripts are transformed using [Babel][babel].

### Features

All features from `es2015`, `es2016`, and `es2017` are included via [`@babel/preset-env`][babel-preset-env]. You can see a list of those features in the [ECMAScript compatibility table][ecmascript-compatibility-table].

### Importing

You can import other JavaScripts using the ES6 module syntax.

```javascript
/* index.js */
import something from "./other.js"

console.log(something)
```

```js
/* other.js */
export default "something"
```

Imported JavaScripts will be treated as dependencies and inlined into the files that import them.

Make sure you reference dependencies relatively with `./` or `../` to ensure they’re treated as dependencies.

#### NPM packages

You can `import` NPM packages as you would normally expect. It will look for packages in the `node_modules` folder at the root of your project.

## Data files

Data files are a way of providing structured data to your templates in order to simplify building your site.

Data files are stored in a `data` folder that must be in the same directory as the `source` folder. They’re siblings. So if the path to `source` is `some/folder/source`, then the path to `data` must be `some/folder/data`.

Data files are JSON files and the name of the file is the object property you use to access that data. So if you have a data file called `albums.json` then you would access the data from the `props` object passed into your template by calling `props.data.albums`.

## Real examples

If you’d like to see everything in practice, check out these sites using Charge.

* [brandonweiss.me](https://github.com/brandonweiss/brandonweiss), a personal site.

## Contributing

Bug reports and pull requests are welcome on GitHub at [https://github.com/brandonweiss/charge][github-charge].

## License

The package is available as open source under the terms of the [MIT License][MIT-license].

[jsx]: https://reactjs.org/docs/introducing-jsx.html
[mdx]: https://github.com/mdx-js/mdx
[babel]: https://babeljs.io
[postcss]: https://postcss.org
[browsersync]: https://browsersync.io
[cssdb]: https://cssdb.org
[custom-media-queries]: https://cssdb.org/#custom-media-queries
[babel-preset-env]: https://babeljs.io/docs/en/babel-preset-env
[ecmascript-compatibility-table]: http://kangax.github.io/compat-table/es2016plus/
[static-gen]: https://www.staticgen.com
[github-charge]: https://github.com/brandonweiss/charge
[MIT-License]: http://opensource.org/licenses/MIT
