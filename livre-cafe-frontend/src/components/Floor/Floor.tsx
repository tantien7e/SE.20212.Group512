import {
  fetchAreas,
  selectAreasData,
  selectAreasLoading,
  updateArea,
} from '@app/app/features/areas/areas-slice';
import AddReservationModal from '@app/components/AddReservationModal';
import FloorElement, { TargetProps } from '@app/components/Floor/FloorElement';
import ListAction from '@app/components/Floor/ListAction';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { Box, Popper } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

function Floor() {
  const areas = useSelector(selectAreasData);
  const areaLoading = useSelector(selectAreasLoading);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [currentTarget, setCurrentTarget] = useState<TargetProps>();
  const [open, setOpen] = React.useState(false);
  const [isMoveable, setIsMoveable] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const dispatch = useDispatch();
  const toggleMoveable = () => {
    setIsMoveable(!isMoveable);
  };

  const handleSave = () => {
    targets.forEach((target) => {
      dispatch(updateArea(target));
    });
  };
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

  useEffect(() => {
    if (!areas) {
      dispatch(fetchAreas());
    }
  }, []);
  useEffect(() => {
    if (areas && !areaLoading) {
      setTargets(
        areas.map((area) => ({
          ...area,
          classSelector: 'targets',
          backgroundColor: 'inherit',
          fontColor: 'black',
        })),
      );
    }
  }, [areas, areaLoading]);

  return (
    <Box
      className="floor-container"
      sx={{
        width: '100%',
        height: '100%',
        perspective: '1000px',
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
      {openAddModal && currentTarget && (
        <AddReservationModal
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
          area={currentTarget}
        />
      )}
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
        <ListAction handleAddReservation={() => setOpenAddModal(true)} />
      </Popper>
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        maxScale={2}
        // minScale={0.5}
        disabled={(currentTarget && open) || isMoveable}
      >
        {({
          zoomIn,
          zoomOut,
          resetTransform,
          setTransform,
          instance,
          ...rest
        }) => (
          <React.Fragment>
            <div className="tools">
              {/* <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button> */}
              {/* <button style={{ marginLeft: '10px' }} onClick={toggleMoveable}>
                Toggle Moveable
              </button>
              <button style={{ marginLeft: '10px' }} onClick={handleSave}>
                Save Position
              </button> */}
            </div>
            <TransformComponent
              wrapperStyle={{
                width: 'calc(100% + 64px)',
                height: `calc(100vh - ${
                  wrapperRef?.current?.getBoundingClientRect().top
                }px)`,
                transformStyle: 'preserve-3d',
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
                id="area-element-container"
              >
                {targets.map((target: TargetProps) => (
                  <FloorElement
                    key={target._id}
                    properties={target}
                    handleClickElement={(
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                      target: TargetProps,
                    ) => handleClickElement(event, target)}
                    active={target._id === currentTarget?._id && open}
                    allowMoveable={isMoveable}
                    updateTarget={(privateProps) => {
                      setTargets((targetArr) => {
                        return targetArr.map((targetState: any) => {
                          if (targetState._id === target._id) {
                            console.log(privateProps.width);
                            return privateProps;
                          }
                          return targetState;
                        });
                      });
                    }}
                  />
                ))}
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Box>
  );
}

export default Floor;
