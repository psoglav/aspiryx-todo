import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
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

export function Sortable(props: { id: string } & PropsWithChildren) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({id: props.id});

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    zIndex: isDragging ? 1 : 0,
    transition: 'transform 200ms ease',
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
