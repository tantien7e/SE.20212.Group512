import requireAuthentication from '@app/hocs/requireAuthentication';
import React from 'react';

function StaffsScreen() {
  return <div>StaffsScreen</div>;
}

export default requireAuthentication(StaffsScreen);
