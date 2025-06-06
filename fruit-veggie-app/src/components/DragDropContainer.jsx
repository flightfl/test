import { DndContext, closestCenter } from '@dnd-kit/core';
import { useComparison } from '../contexts/ComparisonContext';

function DragDropContainer({ children }) {
  const { addToComparison } = useComparison();

  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && over.id === 'comparison-zone') {
      const draggedItem = active.data.current?.produce;
      if (draggedItem) {
        addToComparison(draggedItem);
      }
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}

export default DragDropContainer;