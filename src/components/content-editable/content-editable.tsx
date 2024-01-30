import clsx from "clsx";
import React, { 
  forwardRef, 
  useLayoutEffect, 
  useImperativeHandle, 
  useRef,
  useState,
} from "react";
import './index.css'

function placeCaretAtEnd(el: HTMLElement) {
  const target = document.createTextNode('');
  el.appendChild(target);
}

function replaceCaret(el: HTMLElement) {
  const target = document.createTextNode('');
  placeCaretAtEnd(el)
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

interface Props {
  className?: string
  value?: string
  disabled?: boolean
  placeholder?: string
  changeOnBlur?: boolean
  onFocus?: React.FocusEventHandler<HTMLSpanElement>
  onBlur?: React.FocusEventHandler<HTMLSpanElement>
  onChange?: React.FormEventHandler<HTMLSpanElement>
  onInput?: React.FormEventHandler<HTMLSpanElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement> 
  onKeyUp?: React.KeyboardEventHandler<HTMLSpanElement> 
}

export const ContentEditable = forwardRef<HTMLSpanElement, Props>(({ value = '', disabled = false, changeOnBlur, className, ...props }, outerRef) => {
  const [isEditing, setIsEditing] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(outerRef, () => innerRef.current!, []);
  
  useLayoutEffect(() => {
    if(innerRef.current) {
      replaceCaret(innerRef.current)
    }
  }, [value])

  const emitChange: React.FormEventHandler<HTMLSpanElement> = (e) => {
    const target = e.target as HTMLElement 
    const inputText = target?.innerText?.trim()
    if (!props.onChange) return
    const event: typeof e & { target: { value?: string } } = e
    event.target.value = inputText
    props.onChange(event)
  }

  const onInput: React.FormEventHandler<HTMLSpanElement> = (e) => {
    if (!changeOnBlur) emitChange(e)
    if (props.onInput) props.onInput(e)
  }

  const onFocus: React.FocusEventHandler<HTMLSpanElement> = (e) => {
    if(!disabled) setIsEditing(true)
    if (props.onFocus) props.onFocus(e)
  }

  const onBlur: React.FocusEventHandler<HTMLSpanElement> = (e) => {
    setIsEditing(false)
    if (changeOnBlur) emitChange(e)
    if (props.onBlur) props.onBlur(e)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
    const target = e.target as HTMLElement 
    if (e.key === 'Enter' && props.onChange) {
      e.preventDefault()
      target.blur()
    } else if (e.key === 'Escape') {
      target.blur()
    }
    if (props.onKeyDown) props.onKeyDown(e)
  }

  return (
    <span
      className={clsx(className, 'w-full overflow-hidden whitespace-pre-line break-words align-top outline-none', {
        'cursor-text': !disabled,
        'select-none': !isEditing
      })}
      ref={innerRef}
      suppressContentEditableWarning
      contentEditable={isEditing ? 'plaintext-only' : 'false'}
      spellCheck="false"
      tabIndex={disabled ? undefined : 0}
      dangerouslySetInnerHTML={{__html: value}}
      {...props}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onInput={onInput}
    />
  )
})