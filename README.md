## aframe-3d-calendar-component

[![Version](http://img.shields.io/npm/v/aframe-a-frame-3D-calendar-component.svg?style=flat-square)](https://npmjs.org/package/aframe-3d-calendar-component)
[![License](http://img.shields.io/npm/l/aframe-3d-calendar-component.svg?style=flat-square)](https://npmjs.org/package/aframe-3d-calendar-component)

A A-Frame 3D Calendar component for A-Frame.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| locale   |             | en            |
| -------- | ----------- | ------------- |
| color    |             | white         |
| -------- | ----------- | ------------- |
| colorDays|             | #1589CC       |
| -------- | ----------- | ------------- |
| mode     |             | full          |
| -------- | ----------- | ------------- |
| datas    |             | []            |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-3d-calendar-component/dist/aframe-3d-calendar-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity a-frame-3d-calendar-component="locale: en; color: blue; colorDays: colorDays; mode: full"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-3d-calendar-component
```

Then require and use.

```js
require('aframe');
require('aframe-3d-calendar-component');
```
