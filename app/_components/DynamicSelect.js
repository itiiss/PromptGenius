'use client';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select/creatable'), {
  ssr: false
});

export default Select; 