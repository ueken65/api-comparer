type Props = {
  text: string
}

const Line: React.FC<Props> = ({ text }) => {
  const colorStyle = (() => {
    if (text.startsWith('+')) {
      return 'text-green-500'
    }
    if (text.startsWith('-')) {
      return 'text-red-500'
    }

    return 'text-black'
  })()

  return <p className={colorStyle}>{text}</p>
}

export default Line
