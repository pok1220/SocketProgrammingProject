import React from 'react';
import { FooEvent } from '../../interface';
import { socket } from '../socket';

export function Events({ events }:{events:FooEvent[]}) {
    console.log(events)
    return (
    <>
    <h1>ID: {socket.id}</h1>
    <ul>
    {
      events.map((event, index) =>
        <li key={ index }>{event.message} - {new Date(event.timestamp).toLocaleString()} By-{event.by}</li>
      )
    }
    </ul>
    </>
  );
}