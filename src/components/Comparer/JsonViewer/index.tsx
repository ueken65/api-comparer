import Line from './Line'

type Props = {
  json: string
  loading: boolean
}

const JsonViewer: React.FC<Props> = ({ json, loading }) => {
  const jsonLines = json.split('\n')

  return (
    <div className="bg-gray-200 p-5">
      <code className="whitespace-pre-wrap">
        {loading ? (
          '読み込み中...'
        ) : (
          <>
            {jsonLines.map((line, i) => (
              <Line key={i} text={line} />
            ))}
          </>
        )}
      </code>
    </div>
  )
}

export default JsonViewer
