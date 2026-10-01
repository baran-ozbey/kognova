import React, { useState, useImperativeHandle, forwardRef } from 'react';

const Toast = forwardRef(function Toast(_, ref) {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show(msg, duration = 2000) {
      setText(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), duration);
    },
  }));

  return (
    <div className={`tost${visible ? ' goster' : ''}`}>
      {text}
    </div>
  );
});

export default Toast;
