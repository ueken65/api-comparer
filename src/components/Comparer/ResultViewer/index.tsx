import Line from './Line'

type Props = {
  text: string
  loading: boolean
}

const ResultViewer: React.FC<Props> = ({ text, loading }) => {
  const textLines = text.split('\n')

  return (
    <div className="bg-gray-200 p-5">
      <code className="whitespace-pre-wrap">
        {loading ? (
          '読み込み中...'
        ) : (
          <>
            {textLines.map((line, i) => (
              <Line key={i} text={line} />
            ))}
          </>
        )}
      </code>
    </div>
  )
}

export default ResultViewer
