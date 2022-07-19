import { Box, PopperPlacementType } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { CSSProperties, useEffect, useState } from 'react';
import Moveable from 'react-moveable';

export interface TargetProps {
  _id: string;
  classSelector: string;
  name: string;
  width: number;
  height: number;
  top: number;
  left: number;
  rotate: number;
  backgroundColor: string;
  fontColor: string;
  backgroundImage: string;
}

export interface TempProps {
  left?: number;
  top?: number;
  rotate?: number;
}

interface FloorElementProps {
  properties: TargetProps;
  allowMoveable?: boolean;
  onDuplicate?: (id: string) => void;
  onRemove?: (id: string) => void;
  handleClickElement: (
    event: React.MouseEvent<HTMLButtonElement>,
    target: TargetProps,
  ) => void;
  active: boolean;
  updateTarget: (target: TargetProps) => void;
}

export default function FloorElement(props: FloorElementProps) {
  // Changes in rotate throttle may lead to invalid "left" and "top"
  const throttles = { drag: 10, resize: 10, rotate: 90 };
  const bounds = { left: null, top: null, right: null, bottom: null };
  const {
    properties,
    allowMoveable,
    onDuplicate,
    onRemove,
    handleClickElement,
    active,
    updateTarget,
  } = props;
  const [privateProps, setPrivateProps] = useState(properties);
  const [tempProps, setTempProps] = useState<TempProps>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMoveable, setIsMoveable] = useState(false);
  const [target, setTarget] = useState<HTMLElement>();
  const theme = useTheme();

  useEffect(() => {
    if (document.getElementById(properties._id)) {
      setTarget(document.getElementById(properties._id) || undefined);
    }
  }, [properties._id, properties.classSelector]);

  const generateStyleObject = (attributes: TargetProps): CSSProperties => ({
    position: `absolute`,
    width: `${attributes.width}px`,
    height: `${attributes.height}px`,
    top: `${attributes.top}px`,
    left: `${attributes.left}px`,
    backgroundColor: attributes.backgroundColor,
    transform: `rotate(${attributes.rotate}deg)`,
    color: attributes.fontColor,
    fontWeight: 'bold',
    boxSizing: `border-box`,
    cursor: 'pointer',
    backgroundImage: `url(${attributes.backgroundImage})`,
    backgroundSize: 'contain',
  });

  const onMouseEnter = () => {
    setIsHovered(true);
    setIsMoveable(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    setIsMoveable(isClicked);
  };

  const onMouseDown = () => {
    setIsClicked(true);
    setIsMoveable(true);
  };

  const onMouseUp = () => {
    setIsClicked(false);
    setIsMoveable(isHovered);
  };

  const onDoubleClick = () => {
    setIsHovered(false);
    setIsClicked(false);
    setIsMoveable(false);
  };

  const duplicateButton = (
    <button
    //   onClick={() => onDuplicate(properties._id)}
    //   onTouchStart={() => onDuplicate(properties._id)}
    >
      X2
    </button>
  );

  const removeButton = (
    <button
    //   onClick={() => onRemove(properties._id)}
    //   onTouchStart={() => onRemove(properties._id)}
    >
      RM
    </button>
  );

  // useEffect(() => {
  //   if (privateProps) {

  //   }
  // }, [privateProps]);
  console.log(target);
  return (
    <React.Fragment>
      <Box
        id={properties._id}
        className={properties.classSelector}
        style={generateStyleObject(properties) || {}}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
        sx={{
          boxShadow: active ? theme.shadows[20] : 'none',
          '&:hover': {
            boxShadow: theme.shadows[20],
          },
          // transition: 'transform 0.2s ease',
          border: '1px solid rgba(0,0,0, 0.5)',
          borderRadius: '4px',
          backgroudColor: 'white',
        }}
        onClick={(e: any) => handleClickElement(e, properties)}
        role="button"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `rotate(${-1 * properties.rotate}deg)`,
          }}
        >
          {/* {properties.name} */}

          {/* {allowMoveable ? duplicateButton : null}
          {allowMoveable ? removeButton : null} */}
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              fontFamily: 'Caveat, cursive',
              fontWeight: 600,
              fontSize: '1.5rem',
            }}
          >
            {properties.name}
          </div>
        </div>
        {allowMoveable ? (
          <Moveable
            className="moveable"
            target={target}
            draggable={true}
            resizable={true}
            rotatable={true}
            // pinchable={true}
            snappable={true}
            keepRatio={true}
            throttleDrag={throttles.drag}
            throttleResize={throttles.resize}
            throttleRotate={throttles.rotate}
            bounds={null}
            renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
            edge={false}
            zoom={1}
            origin={false}
            padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
            onDragStart={({ target, clientX, clientY }) => {
              // console.log("onDragStart", target);
            }}
            onDrag={({
              target,
              beforeDelta,
              beforeDist,
              left,
              top,
              right,
              bottom,
              delta,
              dist,
              transform,
              clientX,
              clientY,
            }) => {
              // console.log('onDrag left, top', left, top);
              target.style.left = `${left}px`;
              target.style.top = `${top}px`;
              console.log('onDrag translate', dist);
              // console.log(transform);
              // target.style.transform = transform;
              let deltaX = dist[0];
              let deltaY = dist[1];
              console.log(dist);
              if (privateProps.rotate === 90) {
                deltaX = dist[1] * -1;
                deltaY = dist[0];
              } else if (privateProps.rotate === 180) {
                deltaX = dist[0] * -1;
                deltaY = dist[1] * -1;
              } else if (privateProps.rotate === 270) {
                deltaX = dist[1];
                deltaY = dist[0] * -1;
              }
              setTempProps({ left: deltaX, top: deltaY });
            }}
            onDragEnd={({ target, isDrag, clientX, clientY }) => {
              // console.log("onDragEnd", target, isDrag, clientX, clientY);
              setPrivateProps({
                ...privateProps,
                left:
                  tempProps.left !== undefined
                    ? privateProps.left + tempProps.left
                    : privateProps.left,
                top:
                  tempProps.top !== undefined
                    ? privateProps.top + tempProps.top
                    : privateProps.top,
              });
              setTempProps({});
              updateTarget({
                ...privateProps,
                left:
                  tempProps.left !== undefined
                    ? privateProps.left + tempProps.left
                    : privateProps.left,
                top:
                  tempProps.top !== undefined
                    ? privateProps.top + tempProps.top
                    : privateProps.top,
              });
            }}
            onResizeStart={({ target, clientX, clientY }) => {
              // console.log("onResizeStart", target);
            }}
            onResize={({
              target,
              width,
              height,
              dist,
              delta,
              direction,
              clientX,
              clientY,
            }) => {
              // console.log("onResize", target);
              // console.log("onResize", delta);
              // console.log("onResize", width, height);
              delta[0] && (target.style.width = `${width}px`);
              delta[1] && (target.style.height = `${height}px`);
              setPrivateProps({
                ...privateProps,
                width: width,
                height: height,
              });
              setTempProps({});
            }}
            onResizeEnd={({ target, isDrag, clientX, clientY }) => {
              // console.log("onResizeEnd", target, isDrag);
              updateTarget(privateProps);
            }}
            onRotateStart={({ target, clientX, clientY }) => {
              // console.log("onRotateStart", target);
            }}
            onRotate={({
              target,
              delta,
              dist,
              transform,
              clientX,
              clientY,
            }) => {
              // console.log("onRotate", dist);
              const angle = (privateProps.rotate + dist) % 360;
              setTempProps({ rotate: angle < 0 ? 360 + angle : angle });
              target.style.transform = transform;
            }}
            onRotateEnd={({ target, isDrag, clientX, clientY }) => {
              // console.log("onRotateEnd", target, isDrag);
              setPrivateProps({
                ...privateProps,
                rotate:
                  tempProps.rotate !== undefined
                    ? tempProps.rotate
                    : privateProps.rotate,
              });
              updateTarget({
                ...privateProps,
                rotate:
                  tempProps.rotate !== undefined
                    ? tempProps.rotate
                    : privateProps.rotate,
              });
              setTempProps({});
            }}
            // onPinchStart={({ target, clientX, clientY, datas }) => {
            //   // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
            //   // console.log("onPinchStart");
            // }}
            // onPinch={({ target, clientX, clientY, datas }) => {
            //   // pinch event occur before drag, rotate, scale, resize
            //   // console.log("onPinch");
            // }}
            // onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
            //   // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
            //   // console.log("onPinchEnd");
            // }}
          />
        ) : null}
      </Box>
    </React.Fragment>
  );
}
