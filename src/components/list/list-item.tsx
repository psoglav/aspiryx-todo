import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { List } from "@/types";
import clsx from "clsx";

interface Props {
  value: List
}

export default function ListItem({value}: Props) {
  const { listId } = useParams()
  const isActive = listId === value.id

  return (
    <Link to={`/list/${value.id}`}>
      <Button variant={isActive ? 'secondary' : 'ghost'} className={clsx('w-full justify-start', { 'text-muted-foreground': !isActive })}>
        { value.name }
      </Button>
    </Link>
  )
}