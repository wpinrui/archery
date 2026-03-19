import type { FC } from 'react'
import ReactWorldFlags from 'react-world-flags'

type FlagProps = {
  code?: string
  className?: string
  height?: string | number
  width?: string | number
}

// CJS/ESM interop: Vite may leave the real component at .default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Flag: FC<FlagProps> = (ReactWorldFlags as any).default ?? ReactWorldFlags

export default Flag
