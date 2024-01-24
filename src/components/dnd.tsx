import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PropsWithChildren } from 'react';

export function Droppable(props: PropsWithChildren & { id: string }) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green !important' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}


export function Draggable(props: PropsWithChildren & { id: string }) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    position: 'relative',
    zIndex: isDragging ? 1 : 0,
    transition: !isDragging ? 'transform 200ms ease-out' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}