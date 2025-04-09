import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Message } from '../../interface';

export function MyForm({fooEvent,room}:{fooEvent:Function,room:string}) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event:any) {
    const message:Message={
      message:value,
      by:"you",
      room:room,
      timestamp:new Date().toISOString()
    }
    event.preventDefault();

    fooEvent((prev: any) => [
        ...prev,
        message
      ]);

    setIsLoading(true);
    socket.timeout(5000).emit('create-something', message, () => {
      setIsLoading(false);
    });

  }

  return (
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
}