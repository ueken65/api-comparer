import * as jsonDiff from 'json-diff'
import { useState } from 'react'
import JsonFetcher from './JsonFetcher'
import JsonViewer from './JsonViewer'

export const Comparer = () => {
  const [json, setJson] = useState<{ A: Record<string, unknown> | null; B: Record<string, unknown> | null }>({
    A: null,
    B: null,
  })
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
    if (jsonDiff.diff(json.A, json.B, { keysOnly }) === undefined) {
      setComparedString('no diff.')
    } else {
      const diff = jsonDiff.diffString(json.A, json.B, {
        color: false,
        full: true,
        keysOnly,
      })
      setComparedString(diff)
    }
  }

  return (
    <div className="p-5">
      <div className="border border-gray-300 rounded p-5 mb-5">
        <h2 className="font-bold mb-2">オプション</h2>
        <div className="flex gap-2">
          <input id="keysOnlyCheck" type="checkbox" onChange={(e) => setKeysOnly(e.target.checked)} />
          <label htmlFor="keysOnlyCheck">keyのみを比較する</label>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div>
          <JsonFetcher json={json.A ? JSON.stringify(json.A, null, '  ') : '{}'} setJson={setJsonA} />
        </div>
        <div>
          <JsonFetcher json={json.B ? JSON.stringify(json.B, null, '  ') : '{}'} setJson={setJsonB} />
        </div>
        <div>
          <button
            className="py-1 mb-2 px-3 bg-blue-600 text-white rounded disabled:bg-slate-400 disabled:text-gray-200"
            onClick={handleOnClickCompareButton}
            disabled={json.A === null || json.B === null}
          >
            比較
          </button>
          <JsonViewer json={comparedString ?? ''} loading={false} />
        </div>
      </div>
    </div>
  )
}
