import React from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';

const NoItems = () => {
  return (
    <div className='no-items'>
      <UnorderedListOutlined />
      <div>No Items Found</div>
    </div>
  );
};

export default NoItems;
