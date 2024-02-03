import { setLists } from "@/store/main"
import { Reorder } from "framer-motion"
import type { List } from "@/types"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { ListNavItem } from "./list-nav-item"

interface ListNavGroupProps {
  items: List[]
}

export const ListNavGroup = (props: ListNavGroupProps) => {
  const [lists, setItems] = useState(props.items)
  const dispatch = useDispatch()

  useEffect(() => {
    setItems(props.items)
  }, [props.items])

  function onReorderApplied(value: List[]) {
    dispatch(setLists(value))
  }

  return (
    <Reorder.Group 
      className="space-y-2"
      values={lists} 
      axis="y" 
      onReorder={(items: List[]) => setItems(items)} 
    >
      {lists.map((item) => (
        <ListNavItem key={item.id} value={item} onDragEnd={() => onReorderApplied(lists)} />
      ))}
    </Reorder.Group>
  )
}