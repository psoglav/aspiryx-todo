import Logo from '@/components/app-layout/logo';
import { Icon } from '@iconify/react';
import './index.scss'
import { cn } from '@/lib/utils';

type TitlebarButtonProps = {
  event: AppEvent;
  children?: React.ReactNode;
  className?: string
};

const TitlebarButton = ({ event, children, className }: TitlebarButtonProps) => (
  <div
    className={cn('titlebar-button grid h-full w-11 place-items-center hover:bg-foreground/10 active:bg-foreground/15 transition-colors', className)}
    onClick={() => window.app?.emit(event)}
  >
    {children}
  </div>
);

export default function Titlebar() {
  return (
    <div className='app-drag absolute top-0 z-50 flex h-8 w-screen items-center justify-between md:relative'>
      <div className='flex items-center gap-2 px-2'>
        <Logo />
        <div className='text-sm text-muted-foreground'>Void</div>
      </div>

      <div className='app-no-drag flex h-full text-muted-foreground'>
        <TitlebarButton event="minimize-app">
          <Icon icon="material-symbols:chrome-minimize" />
        </TitlebarButton>
        <TitlebarButton event="maximize-app">
          <Icon icon="material-symbols:chrome-maximize-outline" />
        </TitlebarButton>
        <TitlebarButton 
          event="close-app" 
          className='hover:bg-[#e60c28] hover:text-foreground active:bg-[#ff1433] active:text-foreground'
        >
          <Icon icon="material-symbols:close" />
        </TitlebarButton>
      </div>
    </div>
  )
}
