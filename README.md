# React Canvas Polygons

It is a react component that helps you draw line rectangles and any polygon with canvas on top of images.

Everything that you draw is stored in a state. You can access this state through the property `onCompleteDraw`.

This component was designed to draw fences which are used by computer vision application in the back end.

## Installation

```
npm i -E react-canvas-polygons
```

## Component Props

Prop | Type | Default | Req | Description
--- | --- | --- | --- | ---
**brushSize** | `Number` |  `2` | - | BrushSize to draw
**canUndo** | `Boolean` |  `false` | - | CanUndo
**color** | `String` |  `'#000000'` | - | Color of what we want draw
**height** | `Number` |  `300` | - | the height of the canvas
**imgSrc** | `String` |  | - | Background image to canvas;
**initialData** | `Object` |  | - | Is the data to be be draw when load the component
**tool** | `Enum('Line','Polygon','Rectangle')` |  `'Line'` | - | Shapes that you can select to draw
**width** | `Number` |  `300` | - | The width of canvas

## Clean Canvas


