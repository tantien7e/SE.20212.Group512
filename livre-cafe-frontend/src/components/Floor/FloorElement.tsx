import { AreaInterface, AreaStatus, ReservationStatus } from '@app/models';
import { getEndTime } from '@app/utils';
import { Box, PopperPlacementType, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { padding } from '@mui/system';
import React, { CSSProperties, useEffect, useState } from 'react';
import Moveable from 'react-moveable';

export interface TargetProps extends AreaInterface {
  _id: string;

  name: string;
  width: number;
  height: number;
  y: number;
  x: number;
  rotate: number;

  backgroundImage: string;
  isNotClickable?: boolean;
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
  const throttles = { drag: 1, resize: 1, rotate: 90 };
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
  }, [properties._id]);

  const generateStyleObject = (attributes: TargetProps): CSSProperties => ({
    position: `absolute`,
    width: `${attributes.width}px`,
    height: `${attributes.height}px`,
    top: `${attributes.y}px`,
    left: `${attributes.x}px`,
    // transform: `rotate(${attributes.rotate}deg)`,
    color: 'black',
    fontWeight: 'bold',
    boxSizing: `border-box`,
    cursor: 'pointer',
    backgroundImage: `url(${attributes.backgroundImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
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
  useEffect(() => {
    if (isHovered) {
      const backdrop = document.createElement('div');
      backdrop.id = 'area-backdrop';
      const backdropStyle = backdrop.style;
      backdropStyle.width = '100vw';
      backdropStyle.height = '100vh';
      backdropStyle.background = 'black';
      backdropStyle.opacity = '0.5';
      backdropStyle.zIndex = '1000';
      backdropStyle.position = 'fixed';
      backdropStyle.top = '0';
      backdropStyle.left = '0';
      // document.getElementById('area-element-container')?.appendChild(backdrop);
    } else {
      const backdrop = document.getElementById('area-backdrop');
      backdrop?.remove();
    }
  }, [isHovered]);

  const renderAreaStatusColor = (status: AreaStatus, available: boolean) => {
    if (!available)
      return {
        color: 'gray',
        backgroundColor: theme.palette.secondary.main,
      };
    if (status === AreaStatus.FREE) {
      return {
        color: theme.palette.success.contrastText,
        backgroundColor: theme.palette.success.main,
      };
    }
    if (status === AreaStatus.OCCUPIED) {
      return {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
      };
    }
  };

  return (
    <React.Fragment>
      <Box
        id={properties._id}
        style={generateStyleObject(properties) || {}}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
        sx={{
          boxShadow: active ? theme.shadows[20] : 'none',
          '&:hover': {
            // boxShadow: theme.shadows[20],
            transform: 'translateZ(50px) scale(1.1)',
            zIndex: 1001,
          },
          transition: 'transform 0.6s ease',
          border: 'none',
          borderRadius: '4px',
          backgroudnColor: 'white',
          pointerEvents: properties.isNotClickable ? 'none' : 'auto',
          zIndex: properties.isNotClickable ? -1 : 0,
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
          {!properties.isNotClickable && (
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-150px',
                width: '130px',
                ...renderAreaStatusColor(
                  properties.status,
                  properties.available,
                ),
                borderRadius: '8px',
                padding: '4px',
              }}
            >
              <Typography
                variant="body1"
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontWeight: 600,
                  fontSize: '1.5rem',
                }}
                color="success"
              >
                {!properties.isNotClickable && properties.name}{' '}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  // fontFamily: 'Caveat, cursive',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {!properties.isNotClickable &&
                  `(${!properties.available ? 'blocked' : properties.status}${
                    properties.status === AreaStatus.OCCUPIED
                      ? ' til ' + getEndTime(properties?.reservations?.[0])
                      : ''
                  })`}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  // fontFamily: 'Caveat, cursive',
                  fontWeight: 400,
                  fontSize: '1.5rem',
                  textAlign: 'center',
                }}
              >
                {properties.capacity}
              </Typography>
            </div>
          )}
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
              // console.log(transform);
              // target.style.transform = transform;
              let deltaX = dist[0];
              let deltaY = dist[1];
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
                x:
                  tempProps.left !== undefined
                    ? privateProps.x + tempProps.left
                    : privateProps.x,
                y:
                  tempProps.top !== undefined
                    ? privateProps.y + tempProps.top
                    : privateProps.y,
              });
              setTempProps({});
              updateTarget({
                ...privateProps,
                x:
                  tempProps.left !== undefined
                    ? privateProps.x + tempProps.left
                    : privateProps.x,
                y:
                  tempProps.top !== undefined
                    ? privateProps.y + tempProps.top
                    : privateProps.y,
              });
            }}
            onResizeStart={({ target, clientX, clientY }) => {
              // console.log("onResizeStart", target);
              // console.log(target)
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
