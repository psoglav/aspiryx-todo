import clsx from "clsx";
import React, { 
  forwardRef, 
  useLayoutEffect, 
  useImperativeHandle, 
  useRef,
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
  onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement> 
  onKeyUp?: React.KeyboardEventHandler<HTMLSpanElement> 
}

export const ContentEditable = forwardRef<HTMLSpanElement, Props>(({ value = '', disabled = false, changeOnBlur, ...props }, outerRef) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(outerRef, () => innerRef.current!, []);
  
  useLayoutEffect(() => {
    if(innerRef.current) {
      replaceCaret(innerRef.current)
    }
  }, [value])

  const onChange: React.FormEventHandler<HTMLSpanElement> = (e) => {
    const target = e.target as HTMLElement 
    const inputText = target?.innerText?.trim()

    if (!props.onChange) return

    const event: typeof e & { target: { value?: string } } = e

    event.target.value = inputText

    props.onChange(event)
  }

  const onBlur: React.FocusEventHandler<HTMLSpanElement> = (e) => {
    if (changeOnBlur) onChange(e)
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
      className={clsx(props.className, 'w-full overflow-hidden break-words align-top outline-none', {
        'cursor-text': !disabled
      })}
      style={{
        whiteSpace: 'pre-line'
      }}
      ref={innerRef}
      suppressContentEditableWarning
      contentEditable={disabled ? 'false' : 'plaintext-only'}
      spellCheck="false"
      tabIndex={0}
      dangerouslySetInnerHTML={{__html: value}}
      {...props}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  )
})