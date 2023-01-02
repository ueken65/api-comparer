import JsonViewer from './JsonViewer'
import * as jsonDiff from 'json-diff'
import { useState } from 'react'

export const Comparer = () => {
  const [json, setJson] = useState<{ A: Record<string, unknown>; B: Record<string, unknown> }>({ A: {}, B: {} })
  const [comparedString, setComparedString] = useState<string>()
  const [keysOnly, setKeysOnly] = useState(false)

  const setJsonA = (json: Record<string, unknown>) =>
    setJson((prev) => {
      return { ...prev, A: json }
    })

  const setJsonB = (json: Record<string, unknown>) =>
    setJson((prev) => {
      return { ...prev, B: json }
    })

  const handleOnClickCompareButton = () => {
    setComparedString(jsonDiff.diffString(json.A, json.B, { color: false, full: true, keysOnly }))
  }

  return (
    <div className="max-w-[1280px] mx-auto p-5">
      <div className="border border-gray-300 rounded p-5 mb-5">
        <h2 className="font-bold mb-2">オプション</h2>
        <div className="flex gap-2">
          <input id="keysOnlyCheck" type="checkbox" onChange={(e) => setKeysOnly(e.target.checked)} />
          <label htmlFor="keysOnlyCheck">keyのみを比較する</label>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        <div className="flex-grow">
          <JsonViewer json={JSON.stringify(json.A, null, '  ')} setJson={setJsonA} />
        </div>
        <div>
          <button
            className="py-1 px-3 bg-blue-600 text-white rounded disabled:bg-slate-400 disabled:text-gray-200"
            onClick={handleOnClickCompareButton}
          >
            比較
          </button>
        </div>
        <div className="flex-grow">
          <JsonViewer json={comparedString ?? JSON.stringify(json.B, null, '  ')} setJson={setJsonB} />
        </div>
      </div>
    </div>
  )
}
