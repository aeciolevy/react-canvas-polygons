import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Button, Welcome } from '@storybook/react/demo';
import DrawCanvas from '../DrawCanvas/DrawCanvas';
import Input from './input';
import testData from './data.json';

// console.log(imageSize);
storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

let referenceToCanvas;
const cleanCanvas = (event) => referenceToCanvas.cleanCanvas();

storiesOf('Canvas', module)
.add('Render Canvas', () => <DrawCanvas
  height="240"
  width="300"
  tool="Line"
  imgSrc="https://ric-bucket.s3.amazonaws.com/device_5c05ee0cb669e165879e622a/sensorview.jpg"
  initialData={testData}
  onDataUpdate={(data) => console.log('on data update: ', data)}
  onFinishDraw={() => console.log('Finish draw!!')}
/> )
.add('Render Canvas Brush Size', () => (
  <div>
    <button onClick={cleanCanvas}> Clean Canvas</button>
    <Input render={ state => (
      <DrawCanvas
        ref={test => referenceToCanvas = test}
        height={240}
        width={300}
        imgSrc="https://ric-bucket.s3.amazonaws.com/device_5c05ee0cb669e165879e622a/sensorview.jpg"
        brushSize={Number(state.brush)}
        color={state.color}
        tool={state.tool}
        onDataUpdate={(data) => console.log('data updates: ', data)}
        onFinishDraw={() => console.log('finish draw')}
        initialData={testData}
      />
    )} />
  </div>

))
