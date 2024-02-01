export function PoweredBy() {
  const url = 'https://aspiryx.space'
  return (
    <div className='flex justify-center gap-2 py-1 text-center text-xs text-muted-foreground'>
      <div>powered by</div> 
      <a className='flex gap-1 hover:underline' href={url} target='_blank'>
        <img src={`${url}/logo.svg`} className='size-4' />
        <span>ASPIRYX</span>
      </a>
    </div>
  )
}
