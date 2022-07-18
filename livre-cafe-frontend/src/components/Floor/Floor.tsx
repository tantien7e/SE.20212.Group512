import { AREA_IMAGES } from '@app/assets/images';
import FloorElement, { TargetProps } from '@app/components/Floor/FloorElement';
import ListAction from '@app/components/Floor/ListAction';
import { Box, Popper } from '@mui/material';
import React, { useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

function Floor() {
  const [targets, setTargets] = useState([
    {
      id: 'target',
      classSelector: 'targets',
      name: 'Target1',
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      rotate: 0,
      backgroundColor: 'inherit',
      backgroundImage: AREA_IMAGES.FountainBase,
      fontColor: 'black',
    },
    {
      id: 'target2',
      classSelector: 'targets',
      name: 'Target2',
      width: 200,
      height: 200,
      top: 220,
      left: 500,
      rotate: 0,
      backgroundColor: 'inherit',
      backgroundImage: AREA_IMAGES.CroissantSpace,
      fontColor: 'black',
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [currentTarget, setCurrentTarget] = useState<TargetProps>();
  const [open, setOpen] = React.useState(false);

  const handleClickElement = (
    event: React.MouseEvent<HTMLButtonElement>,
    target: TargetProps,
  ) => {
    const currentArea = event.currentTarget;
    setAnchorEl(event.currentTarget);
    const rect = currentArea.getBoundingClientRect();
    const { left, top } = rect;
    setOpen((prev) => {
      if (anchorEl !== event.currentTarget || !prev) {
      }
      return anchorEl !== event.currentTarget || !prev;
    });
    setCurrentTarget(target);
  };
  const wrapperRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      className="floor-container"
      sx={{
        width: '100%',
        height: '100%',
      }}
      ref={wrapperRef}
      mx={-4}
      // component="button"
      onMouseDown={(e: any) => {
        if (
          !(
            anchorEl?.contains(e.target) ||
            popperRef.current?.contains(e.target)
          )
        ) {
          setOpen(false);
          setAnchorEl(null);
        }
      }}
    >
      <Popper
        open={open}
        placement="right-start"
        anchorEl={anchorEl}
        ref={popperRef}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          // {
          //   name: 'arrow',
          //   enabled: false,
          //   options: {
          //     element: arrowRef,
          //   },
          // },
        ]}
      >
        <ListAction />
      </Popper>
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        maxScale={2}
        disabled={currentTarget && open}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform, ...rest }) => (
          <React.Fragment>
            <TransformComponent
              wrapperStyle={{
                width: 'calc(100% + 64px)',
                height: `calc(100vh - ${
                  wrapperRef?.current?.getBoundingClientRect().top
                }px)`,
              }}
              contentStyle={{
                width: '100%',
                height: `calc(100vh - ${
                  wrapperRef?.current?.getBoundingClientRect().top
                }px)`,
                background:
                  'repeating-linear-gradient(0deg, rgba(120, 120, 120, 0.2), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 120px), repeating-linear-gradient(-90deg, rgba(120, 120, 120, 0.22), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 120px), repeating-linear-gradient(0deg, rgba(120, 120, 120, 0.22), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 30px), repeating-linear-gradient(-90deg, rgba(120, 120, 120, 0.22), rgba(120, 120, 120, 0.22) 2px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 30px)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',

                  // backgroundColor: '#09123a',
                }}
              >
                {targets.map((target: TargetProps) => (
                  <FloorElement
                    key={target.id}
                    properties={target}
                    handleClickElement={(
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                      target: TargetProps,
                    ) => handleClickElement(event, target)}
                    active={target.id === currentTarget?.id && open}
                  />
                ))}
              </div>
            </TransformComponent>
            {/* <div className="tools">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
            </div> */}
          </React.Fragment>
        )}
      </TransformWrapper>
    </Box>
  );
}

export default Floor;
