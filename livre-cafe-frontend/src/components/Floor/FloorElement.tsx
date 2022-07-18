import { Box, PopperPlacementType } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { CSSProperties, useEffect, useState } from 'react';

export interface TargetProps {
  id: string;
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
}

export default function FloorElement(props: FloorElementProps) {
  // Changes in rotate throttle may lead to invalid "left" and "top"
  const throttles = { drag: 10, resize: 10, rotate: 90 };
  const bounds = { left: 0, top: 0, right: 490, bottom: 490 };
  const {
    properties,
    allowMoveable,
    onDuplicate,
    onRemove,
    handleClickElement,
    active,
  } = props;
  const [privateProps, setPrivateProps] = useState(properties);
  const [tempProps, setTempProps] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMoveable, setIsMoveable] = useState(false);
  const [target, setTarget] = useState<HTMLElement>();
  const theme = useTheme();

  useEffect(() => {
    if (document.getElementById(properties.id)) {
      setTarget(document.getElementById(properties.id) || undefined);
    }
  }, [properties.id, properties.classSelector]);

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
    //   onClick={() => onDuplicate(properties.id)}
    //   onTouchStart={() => onDuplicate(properties.id)}
    >
      X2
    </button>
  );

  const removeButton = (
    <button
    //   onClick={() => onRemove(properties.id)}
    //   onTouchStart={() => onRemove(properties.id)}
    >
      RM
    </button>
  );

  return (
    <React.Fragment>
      <Box
        id={properties.id}
        className={properties.classSelector}
        style={generateStyleObject(properties) || {}}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
        // onMouseDown={onMouseDown}
        // onMouseUp={onMouseUp}
        // onDoubleClick={onDoubleClick}
        sx={{
          boxShadow: active ? theme.shadows[20] : 'none',
          '&:hover': {
            boxShadow: theme.shadows[20],
          },
          transition: 'all 0.2s ease',
          border: '1px solid rgba(0,0,0, 0.5)',
          borderRadius: '4px',
          // backgroudColor: 'white',
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
          {allowMoveable ? duplicateButton : null}
          {allowMoveable ? removeButton : null}
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
      </Box>
    </React.Fragment>
  );
}
